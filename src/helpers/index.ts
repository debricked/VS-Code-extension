import * as vscode from "vscode";
import { AuthHelper } from "./auth.helper";
import { StatusBarMessageHelper } from "./statusBarMessage.helper";
import { Terminal } from "./terminal.helper";
import { ShowQuickPickHelper } from "./showQuickPick.helper";
import { StatusMessage } from "./message.helper";
import { Logger } from "./logger.helper";
import { Common } from "./common.helper";
import { Command } from "./command.helper";
import { FileHelper } from "./file.helper";
import { InstallHelper } from "./install.helper";
import { GitHelper } from "./git.helper";
import { ShowInputBoxHelper } from "./showInputBox.helper";
import { DebrickedDataHelper } from "./debrickedData.helper";
import { GlobalState } from "./globalState";
import { ApiHelper } from "./api.helper";
import { ErrorHandler } from "./errorHandler";
import { ApiClient } from "./apiClient";
import { GlobalStore } from "./globalStore";
import { Organization } from "../constants";
import { Template } from "./template";
import { SentryHelper } from "./sentry.helper";
import { DebrickedServiceHelper } from "./debrickedService.helper";

class IndexHelper {
    constructor(
        private debrickedDataHelper: DebrickedDataHelper,
        private commonHelper: Common,
        private gitHelper: GitHelper,
    ) {}

    /**
     * Set up the Debricked environment by checking the user ID.
     */
    public async setupDebricked(context: vscode.ExtensionContext): Promise<void> {
        try {
            globalStore.setGlobalStateInstance(GlobalState.getInstance(context));
            this.debrickedDataHelper.createDir(Organization.reportsFolderPath);
            this.debrickedDataHelper.createDir(context.logUri.fsPath);
            Logger.initialize(context);
            SentryHelper.configureSentry();
            await this.commonHelper.checkUserId();
            await this.gitHelper.setupGit();
        } catch (error: any) {
            Logger.logError("Error in setupDebricked");
            throw error;
        }
    }
}

const statusBarMessageHelper = new StatusBarMessageHelper();
const showInputBoxHelper = new ShowInputBoxHelper();
const debrickedDataHelper = new DebrickedDataHelper();
const globalStore = GlobalStore.getInstance();

const authHelper = new AuthHelper(showInputBoxHelper, Logger, globalStore);
const errorHandler = new ErrorHandler(statusBarMessageHelper, Logger, SentryHelper);
const commandHelper = new Command(authHelper, Logger);
const commonHelper = new Common(Logger, showInputBoxHelper, globalStore, statusBarMessageHelper);
const gitHelper = new GitHelper(
    commandHelper,
    Logger,
    SentryHelper,
    showInputBoxHelper,
    globalStore,
    statusBarMessageHelper,
);
const terminal = new Terminal(authHelper, Logger);
const apiClient = new ApiClient(authHelper, errorHandler, Logger);
const apiHelper = new ApiHelper(apiClient, Logger);
const installHelper = new InstallHelper(Logger, statusBarMessageHelper, commandHelper);
const fileHelper = new FileHelper(debrickedDataHelper, Logger);
const indexHelper = new IndexHelper(debrickedDataHelper, commonHelper, gitHelper);
const showQuickPickHelper = new ShowQuickPickHelper();
const template = new Template();
const debrickedServiceHelper = new DebrickedServiceHelper(apiHelper, Logger);

export {
    authHelper,
    statusBarMessageHelper,
    terminal,
    showQuickPickHelper,
    StatusMessage,
    Logger,
    commonHelper,
    commandHelper,
    fileHelper,
    installHelper,
    gitHelper,
    showInputBoxHelper,
    debrickedDataHelper,
    apiHelper,
    errorHandler,
    apiClient,
    globalStore,
    indexHelper,
    template,
    SentryHelper,
    debrickedServiceHelper,
};
