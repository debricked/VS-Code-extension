import { MessageStatus } from "../constants/index";
import { Command } from "./commandHelper";
import { GlobalState } from "./globalState";
import { Logger } from "./loggerHelper";
import { ShowInputBoxHelper } from "./showInputBoxHelper";

export class GitHelper {
    constructor(
        private command: Command,
        private logger: typeof Logger,
        private showInputBoxHelper: ShowInputBoxHelper,
        private globalState: typeof GlobalState,
    ) {}

    public async getCurrentBranch() {
        return await this.command.executeAsyncCommand("git branch --show-current");
    }

    public async getCommitHash(): Promise<string> {
        return (await this.command.executeAsyncCommand("git rev-parse HEAD")) || `${new Date().toISOString()}`;
    }

    public async getRemoteUrl(): Promise<string> {
        return await this.command.executeAsyncCommand("git config --get remote.origin.url");
    }

    public async getStatus(): Promise<string> {
        return await this.command.executeAsyncCommand("git status --short");
    }

    public async getLog(n: number = 10): Promise<string> {
        return await this.command.executeAsyncCommand(`git log -n ${n} --pretty=format:"%h - %an, %ar : %s"`);
    }

    public async getUsername(): Promise<string | undefined> {
        return (
            (await this.command.executeAsyncCommand("git config --get user.name")) ||
            this.showInputBoxHelper.promptForInput(
                { prompt: "Git user name", placeHolder: "Please enter User Name" },
                "unknown-user",
            )
        );
    }

    public async getEmail(): Promise<string | undefined> {
        return (
            (await this.command.executeAsyncCommand("git config --get user.email")) ||
            this.showInputBoxHelper.promptForInput(
                { prompt: "Git user email", placeHolder: "Please enter Email ID" },
                "unknown-email",
            )
        );
    }

    public async getUpstream(): Promise<string> {
        return await this.command.executeAsyncCommand("git remote get-url origin");
    }

    public async getRepositoryName(): Promise<string> {
        return (
            (await this.command.executeAsyncCommand("git rev-parse --show-toplevel").then((repoPath) => {
                return repoPath.split("/").pop() || repoPath.split("\\").pop() || "";
            })) || MessageStatus.UNKNOWN
        );
    }

    public async setupGit(): Promise<void> {
        const currentRepo = await this.getUpstream();
        this.logger.logMessageByStatus(MessageStatus.INFO, `Current repository: ${currentRepo}`);
        const selectedRepoName: string = await this.getRepositoryName();
        let repoData: any = await this.globalState.getInstance().getGlobalData(selectedRepoName, {});

        if (selectedRepoName) {
            if (!repoData) {
                repoData = {};
            }
            repoData.repositoryName = selectedRepoName;
        }

        repoData.userName = await this.getUsername();
        repoData.email = await this.getEmail();
        repoData.currentBranch = await this.getCurrentBranch();
        repoData.commitID = await this.getCommitHash();

        await this.globalState.getInstance().setGlobalData(selectedRepoName, repoData);
    }
}
