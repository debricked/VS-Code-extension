import { MessageStatus, Organization } from "../constants/index";
import { Command, GlobalState, Logger, ShowInputBoxHelper } from "../helpers";

export class GitHelper {
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }
    public static async getCurrentBranch() {
        return await Command.executeAsyncCommand("git branch --show-current");
    }

    public static async getCommitHash(): Promise<string> {
        return await Command.executeAsyncCommand("git rev-parse HEAD");
    }

    public static async getRemoteUrl(): Promise<string> {
        return await Command.executeAsyncCommand("git config --get remote.origin.url");
    }

    public static async getStatus(): Promise<string> {
        return await Command.executeAsyncCommand("git status --short");
    }

    public static async getLog(n: number = 10): Promise<string> {
        return await Command.executeAsyncCommand(`git log -n ${n} --pretty=format:"%h - %an, %ar : %s"`);
    }

    public static async getUsername(): Promise<string> {
        return (
            (await Command.executeAsyncCommand("git config --get user.name")) ||
            ShowInputBoxHelper.inputData("Please enter User Name", "unknown-user")
        );
    }

    public static async getEmail(): Promise<string> {
        return (
            (await Command.executeAsyncCommand("git config --get user.email")) ||
            ShowInputBoxHelper.inputData("Please enter Email ID", "unknown-email")
        );
    }

    public static async getUpstream(): Promise<string> {
        return await Command.executeAsyncCommand("git remote get-url origin");
    }

    public static async getRepositoryName(): Promise<string> {
        return (
            (await Command.executeAsyncCommand("git rev-parse --show-toplevel").then((repoPath) => {
                return repoPath.split("/").pop() || repoPath.split("\\").pop() || "";
            })) || "unknown"
        );
    }

    public static async setupGit(): Promise<void> {
        const currentRepo = await GitHelper.getUpstream();
        Logger.logMessageByStatus(MessageStatus.INFO, `Current repository: ${currentRepo}`);
        const repoData: any = await GitHelper.globalState.getGlobalData(Organization.REPO_DATA_KEY, {});
        let selectedRepoName: string;

        if (currentRepo.indexOf(".git") > -1) {
            selectedRepoName = await GitHelper.getRepositoryName();
        } else {
            selectedRepoName = "unknown";
        }

        if (selectedRepoName) {
            if (!repoData[selectedRepoName]) {
                repoData[selectedRepoName] = {};
            }
        }

        repoData[selectedRepoName].userName = await GitHelper.getUsername();
        repoData[selectedRepoName].email = await GitHelper.getEmail();

        await GitHelper.globalState.setGlobalData(Organization.DEBRICKED_DATA_KEY, repoData);
    }
}
