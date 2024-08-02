import { AuthHelper } from "./authHelper";
import { StatusBarMessageHelper } from "./statusBarMessageHelper";
import { Terminal } from "./terminalHelper";
import { QuickPick } from "./showQuickPickHelper";
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

const statusBarMessageHelper = new StatusBarMessageHelper();
const showInputBoxHelper = new ShowInputBoxHelper();
const debrickedDataHelper = new DebrickedDataHelper(Logger);

const authHelper = new AuthHelper(showInputBoxHelper, statusBarMessageHelper, Logger, GlobalState);
const errorHandler = new ErrorHandler(statusBarMessageHelper, Logger);
const commandHelper = new Command(errorHandler, authHelper, Logger);
const commonHelper = new Common(errorHandler, debrickedDataHelper, Logger, showInputBoxHelper, GlobalState);
const globalStore = GlobalStore.getInstance(commonHelper);
const gitHelper = new GitHelper(commandHelper, Logger, showInputBoxHelper, GlobalState);
const terminal = new Terminal(authHelper, Logger);
const apiClient = new ApiClient(authHelper, errorHandler, Logger);
const apiHelper = new ApiHelper(apiClient, Logger);
const installHelper = new InstallHelper(errorHandler, Logger, statusBarMessageHelper);
const fileHelper = new FileHelper(debrickedDataHelper, Logger);

export {
    authHelper,
    statusBarMessageHelper,
    terminal,
    QuickPick,
    StatusMessage,
    Logger,
    Common,
    commonHelper,
    commandHelper,
    fileHelper,
    installHelper,
    gitHelper,
    showInputBoxHelper,
    debrickedDataHelper,
    GlobalState,
    apiHelper,
    errorHandler,
    apiClient,
    globalStore,
};
