import * as vscode from "vscode";
import { AuthHelper } from "./authHelper";
import { StatusBarMessageHelper } from "./statusBarMessageHelper";
import { Terminal } from "./terminalHelper";
import { ShowQuickPickHelper } from "./showQuickPickHelper";
import { StatusMessage } from "./messageHelper";
import { Logger } from "./loggerHelper";
import { Common } from "./commonHelper";
import { Command } from "./commandHelper";
import { FileHelper } from "./fileHelper";
import { InstallHelper } from "./installHelper";
import { GitHelper } from "./gitHelper";
import { ShowInputBoxHelper } from "./showInputBoxHelper";
import { DebrickedDataHelper } from "./debrickedDataHelper";
import { GlobalState } from "./globalState";
import { ApiHelper } from "./apiHelper";
import { ErrorHandler } from "./errorHandler";
import { ApiClient } from "./apiClient";
import { GlobalStore } from "./globalStore";
import { Organization } from "../constants";
import { Template } from "./template";
import { SentryHelper } from "./sentryHelper";
import { DebrickedServiceHelper } from "./debrickedServiceHelper";

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

const authHelper = new AuthHelper(showInputBoxHelper, statusBarMessageHelper, Logger, globalStore);
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
