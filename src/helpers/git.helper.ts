import * as path from "path";
import { Messages, MessageStatus } from "../constants/index";
import { Command } from "./command.helper";
import { GlobalStore } from "./globalStore";
import { Logger } from "./logger.helper";
import { ShowInputBoxHelper } from "./showInputBox.helper";
import { StatusBarMessageHelper } from "./statusBarMessage.helper";
import { SentryHelper } from "./sentry.helper";

export class GitHelper {
    constructor(
        private command: Command,
        private logger: typeof Logger,
        private sentryHelper: typeof SentryHelper,
        private showInputBoxHelper: ShowInputBoxHelper,
        private globalStore: GlobalStore,
        private statusBarMessageHelper: StatusBarMessageHelper,
    ) {}

    public async getCurrentBranch() {
        return await this.executeAsyncCommand("git branch --show-current");
    }

    public async getCommitHash(): Promise<string> {
        return (await this.executeAsyncCommand("git rev-parse HEAD")) || `${new Date().toISOString()}`;
    }

    public async getRemoteUrl(): Promise<string> {
        return await this.executeAsyncCommand("git config --get remote.origin.url");
    }

    public async getStatus(): Promise<string> {
        return await this.executeAsyncCommand("git status --short");
    }

    public async getLog(n = 10): Promise<string> {
        return await this.executeAsyncCommand(`git log -n ${n} --pretty=format:"%h - %an, %ar : %s"`);
    }

    public async getUsername(): Promise<string | undefined> {
        return (
            (await this.executeAsyncCommand("git config --get user.name")) ||
            this.showInputBoxHelper.promptForInput(
                { prompt: "Git user name", placeHolder: "Please enter User Name" },
                "unknown-user",
            )
        );
    }

    public async getEmail(): Promise<string | undefined> {
        return (
            (await this.executeAsyncCommand("git config --get user.email")) ||
            this.showInputBoxHelper.promptForInput(
                { prompt: "Git user email", placeHolder: "Please enter Email ID" },
                "unknown-email",
            )
        );
    }

    public async getUpstream(): Promise<string> {
        return await this.executeAsyncCommand("git remote get-url origin");
    }

    public async setupGit(): Promise<void> {
        const currentRepo = path.basename(await this.getUpstream()).split(".")[0];
        this.logger.logMessageByStatus(MessageStatus.INFO, `Current repository: ${currentRepo}`);

        this.globalStore.setRepository(currentRepo);
        let repoData: any = await this.globalStore.getGlobalStateInstance()?.getGlobalData(currentRepo, {});

        if (currentRepo) {
            if (!repoData) {
                repoData = {};
            }
            repoData.repositoryName = currentRepo;
        }

        repoData.userName = await this.getUsername();
        repoData.email = await this.getEmail();

        const userId = this.globalStore.getUserId() || "";
        this.sentryHelper.setUser({ id: userId, email: repoData.email, username: repoData.userName });

        if (currentRepo !== MessageStatus.UNKNOWN) {
            repoData.currentBranch = await this.getCurrentBranch();
            repoData.commitID = await this.getCommitHash();
        } else {
            this.statusBarMessageHelper.showWarningMessage(Messages.NO_REPO);
        }

        await this.globalStore.getGlobalStateInstance()?.setGlobalData(currentRepo, repoData);
    }

    private async executeAsyncCommand(command: string): Promise<string> {
        try {
            return await this.command.executeAsyncCommand(command);
        } catch (error: any) {
            Logger.logError(error);
            this.sentryHelper.captureException(new Error(`Git Error : ${command}`, error));
            return MessageStatus.UNKNOWN;
        }
    }
}
