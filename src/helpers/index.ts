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

const authHelper = new AuthHelper();
const commonHelper = new Common();
const commandHelper = new Command();
const showInputBoxHelper = new ShowInputBoxHelper();
const debrickedDataHelper = new DebrickedDataHelper(Logger);
const globalStore = GlobalStore.getInstance(commonHelper);

const gitHelper = new GitHelper(commandHelper, Logger, showInputBoxHelper);
const terminal = new Terminal(authHelper, Logger);
const apiClient = new ApiClient(authHelper);
const apiHelper = new ApiHelper(apiClient, Logger);

export {
    authHelper,
    StatusBarMessageHelper,
    terminal,
    QuickPick,
    StatusMessage,
    Logger,
    Common,
    commonHelper,
    Command,
    commandHelper,
    FileHelper,
    InstallHelper,
    gitHelper,
    showInputBoxHelper,
    debrickedDataHelper,
    GlobalState,
    apiHelper,
    ErrorHandler,
    apiClient,
    globalStore,
};
