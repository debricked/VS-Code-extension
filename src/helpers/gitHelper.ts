import { MessageStatus } from "../constants/index";
import { Command, GlobalState, Logger, ShowInputBoxHelper } from ".";

export class GitHelper {
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }
    public static async getCurrentBranch() {
        return await Command.executeAsyncCommand("git branch --show-current");
    }

    public static async getCommitHash(): Promise<string> {
        return (await Command.executeAsyncCommand("git rev-parse HEAD")) || `${new Date().toISOString()}`;
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

    public static async getUsername(): Promise<string | undefined> {
        return (
            (await Command.executeAsyncCommand("git config --get user.name")) ||
            ShowInputBoxHelper.promptForInput(
                { prompt: "Git user name", placeHolder: "Please enter User Name" },
                "unknown-user",
            )
        );
    }

    public static async getEmail(): Promise<string | undefined> {
        return (
            (await Command.executeAsyncCommand("git config --get user.email")) ||
            ShowInputBoxHelper.promptForInput(
                { prompt: "Git user email", placeHolder: "Please enter Email ID" },
                "unknown-email",
            )
        );
    }

    public static async getUpstream(): Promise<string> {
        return await Command.executeAsyncCommand("git remote get-url origin");
    }

    public static async getRepositoryName(): Promise<string> {
        return (
            (await Command.executeAsyncCommand("git rev-parse --show-toplevel").then((repoPath) => {
                return repoPath.split("/").pop() || repoPath.split("\\").pop() || "";
            })) || MessageStatus.UNKNOWN
        );
    }

    public static async setupGit(): Promise<void> {
        const currentRepo = await GitHelper.getUpstream();
        Logger.logMessageByStatus(MessageStatus.INFO, `Current repository: ${currentRepo}`);
        const selectedRepoName: string = await GitHelper.getRepositoryName();
        let repoData: any = await GitHelper.globalState.getGlobalData(selectedRepoName, {});

        if (selectedRepoName) {
            if (!repoData) {
                repoData = {};
            }
            repoData.repositoryName = selectedRepoName;
        }

        repoData.userName = await GitHelper.getUsername();
        repoData.email = await GitHelper.getEmail();
        repoData.currentBranch = await GitHelper.getCurrentBranch();
        repoData.commitID = await GitHelper.getCommitHash();

        await GitHelper.globalState.setGlobalData(selectedRepoName, repoData);
    }
}
