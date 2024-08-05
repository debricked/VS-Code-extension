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

class IndexHelper {
    constructor(
        private debrickedDataHelper: DebrickedDataHelper,
        private commonHelper: Common,
    ) {}

    /**
     * Set up the Debricked environment by generating a sequence ID and checking the user ID.
     */
    public async setupDebricked(context: vscode.ExtensionContext): Promise<void> {
        try {
            // Set up global error handlers
            errorHandler.setupGlobalErrorHandlers();
            GlobalState.initialize(context);

            await this.commonHelper.checkUserId();
            this.debrickedDataHelper.createDir(Organization.reportsFolderPath);
            this.debrickedDataHelper.createDir(context.logUri.fsPath);

            Logger.initialize(context);

            globalStore.setGlobalStateInstance(GlobalState.getInstance());
        } catch (error: any) {
            throw error;
        }
    }
}

const statusBarMessageHelper = new StatusBarMessageHelper();
const showInputBoxHelper = new ShowInputBoxHelper();
const debrickedDataHelper = new DebrickedDataHelper(Logger);
const globalStore = GlobalStore.getInstance();

const authHelper = new AuthHelper(showInputBoxHelper, statusBarMessageHelper, Logger, GlobalState);
const errorHandler = new ErrorHandler(statusBarMessageHelper, Logger);
const commandHelper = new Command(authHelper, Logger);
const commonHelper = new Common(Logger, showInputBoxHelper, GlobalState);
const gitHelper = new GitHelper(commandHelper, Logger, showInputBoxHelper, GlobalState);
const terminal = new Terminal(authHelper, Logger);
const apiClient = new ApiClient(authHelper, errorHandler, Logger);
const apiHelper = new ApiHelper(apiClient, Logger);
const installHelper = new InstallHelper(Logger, statusBarMessageHelper);
const fileHelper = new FileHelper(debrickedDataHelper, Logger);
const indexHelper = new IndexHelper(debrickedDataHelper, commonHelper);
const showQuickPickHelper = new ShowQuickPickHelper();

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
};
