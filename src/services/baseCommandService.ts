import { DebrickedCommandNode } from "../types";
import { DebrickedCommands, Messages, MessageStatus, Organization, TokenType } from "../constants/index";
import {
    statusBarMessageHelper,
    terminal,
    StatusMessage,
    Logger,
    showQuickPickHelper,
    installHelper,
    authHelper,
    errorHandler,
    globalStore,
    showInputBoxHelper,
    SentryHelper,
} from "../helpers";
import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";

export class BaseCommandService {
    constructor() {
        this.baseCommand = this.baseCommand.bind(this);
        this.getCurrentExtensionVersion = this.getCurrentExtensionVersion.bind(this);
        this.help = this.help.bind(this);
        this.installCommand = this.installCommand.bind(this);
        this.login = this.login.bind(this);
        this.updateCommand = this.updateCommand.bind(this);
    }
    public async baseCommand() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register BaseCommand");
            const subCommand: DebrickedCommandNode[] | undefined = DebrickedCommands.BASE_COMMAND.sub_commands;

            let selectedSubCommand: any;
            if (subCommand) {
                selectedSubCommand = await showQuickPickHelper.showQuickPick(subCommand, Messages.QUICK_PICK_FLAG);
            }

            switch (selectedSubCommand?.cli_command) {
                case "install":
                    this.installCommand();
                    break;

                case "token":
                    this.updateCommand();
                    break;

                case "help":
                    this.help();
                    break;

                case "log":
                    Logger.openLogFile();
                    break;

                case "sentry":
                    await SentryHelper.reConfigureSentry();
                    break;

                case "login":
                    this.login();
                    break;

                default:
                    statusBarMessageHelper.setStatusBarMessage(
                        StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.BASE_COMMAND.cli_command),
                    );
                    terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description);
                    statusBarMessageHelper.setStatusBarMessage(
                        StatusMessage.getStatusMessage(
                            MessageStatus.COMPLETE,
                            DebrickedCommands.BASE_COMMAND.cli_command,
                        ),
                    );
                    break;
            }
        } catch (error: any) {
            errorHandler.handleError(error);
        } finally {
            statusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.cli_command),
            );
        }
    }

    public async help() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register HelpCommand");
            const cmdParams = [];
            const subCommand: any = DebrickedCommands.BASE_COMMAND;

            let selectedFlags: any;
            if (subCommand.command) {
                selectedFlags = await showQuickPickHelper.showQuickPick(subCommand.flags, Messages.QUICK_PICK_FLAG);
            }

            if (selectedFlags) {
                cmdParams.push(selectedFlags.flag);
                await terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description, cmdParams);
                statusBarMessageHelper.setStatusBarMessage(
                    StatusMessage.getStatusMessage(MessageStatus.COMPLETE, DebrickedCommands.BASE_COMMAND.cli_command),
                );
            }
        } catch (error: any) {
            errorHandler.handleError(error);
        }
    }

    public async installCommand() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register InstallCommand");
            SentryHelper.setTransactionName("Install CLI");

            const currentVersion = await this.getCurrentExtensionVersion();
            Logger.logMessageByStatus(
                MessageStatus.INFO,
                `${Organization.isFirstActivationKey}: ${globalStore.getGlobalStateInstance()?.getGlobalData(Organization.isFirstActivationKey, "")} - ${Organization.extensionVersionKey}: ${currentVersion}`,
            );

            await installHelper.runInstallScript();
            const debrickedData: any = await globalStore
                .getGlobalStateInstance()
                ?.getGlobalData(Organization.debrickedDataKey, {});
            debrickedData[Organization.isFirstActivationKey] = false;
            debrickedData[Organization.extensionVersionKey] = currentVersion;

            globalStore.getGlobalStateInstance()?.setGlobalData(Organization.debrickedDataKey, debrickedData);
            Logger.logMessageByStatus(
                MessageStatus.INFO,
                `${Organization.extensionVersionKey}: ${debrickedData[Organization.extensionVersionKey]}`,
            );
        } catch (error: any) {
            errorHandler.handleError(error);
        } finally {
            statusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.command),
            );
        }
    }

    public async login(updateCredentials = true) {
        try {
            Logger.logInfo("Register login");
            SentryHelper.setTransactionName("Login");

            const debrickedData: any = await globalStore
                .getGlobalStateInstance()
                ?.getGlobalData(Organization.debrickedDataKey, {});

            if (updateCredentials) {
                debrickedData["debricked_username"] = await showInputBoxHelper.promptForInput(
                    {
                        prompt: "Enter debricked user name",
                        placeHolder: "Please enter debricked User Name",
                    },
                    undefined,
                );
                debrickedData["debricked_password"] = await showInputBoxHelper.promptForInput(
                    {
                        prompt: "Enter debricked password",
                        placeHolder: "Please enter debricked password",
                        password: true,
                    },
                    undefined,
                );

                globalStore.getGlobalStateInstance()?.setGlobalData(Organization.debrickedDataKey, debrickedData);
            }
            const execAsync = promisify(exec);
            const { stdout } = await execAsync(
                `curl -X POST https://debricked.com/api/login_check -d _username=${debrickedData["debricked_username"]} -d _password=${debrickedData["debricked_password"]}`,
                {},
            );
            const bearerToken = JSON.parse(stdout.trim());

            if (bearerToken && bearerToken.code === 401) {
                throw new Error(bearerToken.message);
            } else {
                const newBearerToken = `Bearer ${bearerToken.token}`;
                await authHelper.setToken(TokenType.BEARER, newBearerToken);

                Logger.logInfo(`Token generated successfully`);
            }
        } catch (error: any) {
            statusBarMessageHelper.showErrorMessage(error);
            SentryHelper.captureException(new Error(error));
        } finally {
            statusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.command),
            );
        }
    }

    public async updateCommand() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register UpdateCommand");
            SentryHelper.setTransactionName("Update Token");
            let subCommand: DebrickedCommandNode[] | undefined;
            if (DebrickedCommands.BASE_COMMAND.sub_commands) {
                subCommand = DebrickedCommands.BASE_COMMAND.sub_commands[1].sub_commands;
            }

            let selectedSubCommand: any;
            if (subCommand) {
                selectedSubCommand = await showQuickPickHelper.showQuickPick(subCommand, Messages.QUICK_PICK_TOKEN);
            }
            switch (selectedSubCommand?.cli_command) {
                case "accessToken":
                    authHelper.getToken(false, TokenType.ACCESS);
                    break;
                case "bearerToken":
                    authHelper.getToken(false, TokenType.BEARER);
                    break;
            }
        } catch (error: any) {
            errorHandler.handleError(error);
        } finally {
            statusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.command),
            );
        }
    }

    public async getCurrentExtensionVersion(): Promise<string> {
        const extension = vscode.extensions.getExtension(`${Organization.name}.${Organization.packageJson.name}`);
        return extension ? extension.packageJSON.version : Organization.packageJson.version;
    }
}
