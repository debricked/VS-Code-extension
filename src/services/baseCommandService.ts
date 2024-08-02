import { DebrickedCommandNode } from "../types";
import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";
import {
    statusBarMessageHelper,
    terminal,
    StatusMessage,
    Logger,
    QuickPick,
    installHelper,
    authHelper,
    errorHandler,
    globalStore,
    commandHelper,
    showInputBoxHelper,
} from "../helpers";
import * as vscode from "vscode";
import { GlobalState } from "helpers/globalState";
export class BaseCommandService {
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }

    static async baseCommand() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register BaseCommand");
            globalStore.setSequenceID();
            const subCommand: DebrickedCommandNode[] | undefined = DebrickedCommands.BASE_COMMAND.sub_commands;

            let selectedSubCommand: any;
            if (subCommand) {
                selectedSubCommand = await QuickPick.showQuickPick(subCommand, Messages.QUICK_PICK_FLAG);
            }

            switch (selectedSubCommand?.cli_command) {
                case "install":
                    BaseCommandService.installCommand();
                    break;

                case "token":
                    BaseCommandService.updateCommand();
                    break;

                case "help":
                    BaseCommandService.help();
                    break;

                case "log":
                    Logger.openLogFile();
                    break;

                case "login":
                    BaseCommandService.login();
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

    static async help() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register HelpCommand");
            globalStore.setSequenceID();
            const cmdParams = [];
            const subCommand: any = DebrickedCommands.BASE_COMMAND;

            let selectedFlags: any;
            if (subCommand.command) {
                selectedFlags = await QuickPick.showQuickPick(subCommand.flags, Messages.QUICK_PICK_FLAG);
            }

            let accessTokenRequired: boolean = false;
            if (selectedFlags && selectedFlags.flag) {
                accessTokenRequired = selectedFlags.flag === "-t" ? true : false;
                if (!accessTokenRequired) {
                    cmdParams.push(selectedFlags.flag);
                }
            }

            statusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.BASE_COMMAND.cli_command),
            );
            terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description, cmdParams, accessTokenRequired);
            statusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.COMPLETE, DebrickedCommands.BASE_COMMAND.cli_command),
            );
        } catch (error: any) {
            errorHandler.handleError(error);
        } finally {
            statusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.cli_command),
            );
        }
    }

    static async installCommand() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register InstallCommand");
            globalStore.setSequenceID();

            const currentVersion = await BaseCommandService.getCurrentExtensionVersion();
            Logger.logMessageByStatus(
                MessageStatus.INFO,
                `${Organization.isFirstActivationKey}: ${BaseCommandService.globalState.getGlobalData(Organization.isFirstActivationKey, "")} - ${Organization.extensionVersionKey}: ${currentVersion}`,
            );

            await installHelper.runInstallScript();
            const debrickedData: any = await BaseCommandService.globalState.getGlobalData(
                Organization.debrickedDataKey,
                {},
            );
            debrickedData[Organization.isFirstActivationKey] = false;
            debrickedData[Organization.extensionVersionKey] = currentVersion;

            BaseCommandService.globalState.setGlobalData(Organization.debrickedDataKey, debrickedData);
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

    static async login(updateCredentials: boolean = false) {
        try {
            Logger.logInfo("Register login");
            globalStore.setSequenceID();

            const debrickedData: any = await BaseCommandService.globalState.getGlobalData(
                Organization.debrickedDataKey,
                {},
            );

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

                BaseCommandService.globalState.setGlobalData(Organization.debrickedDataKey, debrickedData);
            }
            const bearerToken = JSON.parse(
                await commandHelper.executeAsyncCommand(
                    `curl -X POST https://debricked.com/api/login_check -d _username=${debrickedData["debricked_username"]} -d _password=${debrickedData["debricked_password"]}`,
                ),
            );

            if (bearerToken && bearerToken.code === 401) {
                throw new Error(bearerToken.message);
            } else {
                const newBearerToken = `Bearer ${bearerToken.token}`;
                await authHelper.setToken(Organization.bearer, newBearerToken, Organization.bearerTokenKey);

                Logger.logInfo(`Token generated successfully`);
            }
        } catch (error: any) {
            errorHandler.handleError(error);
        } finally {
            statusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.command),
            );
        }
    }

    static async updateCommand() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register UpdateCommand");
            globalStore.setSequenceID();
            let subCommand: DebrickedCommandNode[] | undefined;
            if (DebrickedCommands.BASE_COMMAND.sub_commands) {
                subCommand = DebrickedCommands.BASE_COMMAND.sub_commands[1].sub_commands;
            }

            let selectedSubCommand: any;
            if (subCommand) {
                selectedSubCommand = await QuickPick.showQuickPick(subCommand, Messages.QUICK_PICK_TOKEN);
            }
            switch (selectedSubCommand?.cli_command) {
                case "accessToken":
                    authHelper.getToken(false, Organization.access);
                    break;
                case "bearerToken":
                    authHelper.getToken(false, Organization.bearer);
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

    static async getCurrentExtensionVersion(): Promise<string> {
        const extension = vscode.extensions.getExtension(`${Organization.name}.${Organization.extensionName}`);
        return extension ? extension.packageJSON.version : Organization.baseVersion;
    }
}
