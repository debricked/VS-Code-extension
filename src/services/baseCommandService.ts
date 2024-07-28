import { DebrickedCommandNode } from "../types";
import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";
import {
    StatusBarMessageHelper,
    Terminal,
    StatusMessage,
    Logger,
    QuickPick,
    InstallHelper,
    Common,
    AuthHelper,
    ErrorHandler,
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
            BaseCommandService.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());
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

                default:
                    StatusBarMessageHelper.setStatusBarMessage(
                        StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.BASE_COMMAND.cli_command),
                    );
                    Terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description);
                    StatusBarMessageHelper.setStatusBarMessage(
                        StatusMessage.getStatusMessage(
                            MessageStatus.COMPLETE,
                            DebrickedCommands.BASE_COMMAND.cli_command,
                        ),
                    );
                    break;
            }
        } catch (error: any) {
            ErrorHandler.handleError(error);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.cli_command),
            );
        }
    }

    static async help() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register HelpCommand");
            BaseCommandService.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());
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

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.BASE_COMMAND.cli_command),
            );
            Terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description, cmdParams, accessTokenRequired);
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.COMPLETE, DebrickedCommands.BASE_COMMAND.cli_command),
            );
        } catch (error: any) {
            throw error;
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.cli_command),
            );
        }
    }

    static async installCommand() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register InstallCommand");
            BaseCommandService.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());

            const currentVersion = await BaseCommandService.getCurrentExtensionVersion();
            const installer = new InstallHelper();
            Logger.logMessageByStatus(
                MessageStatus.INFO,
                `${Organization.isFirstActivationKey}: ${BaseCommandService.globalState.getGlobalData(Organization.isFirstActivationKey, "")} - ${Organization.extensionVersionKey}: ${currentVersion}`,
            );

            await installer.runInstallScript();
            BaseCommandService.globalState.setGlobalData(Organization.isFirstActivationKey, false);
            BaseCommandService.globalState.setGlobalData(Organization.extensionVersionKey, currentVersion);

            Logger.logMessageByStatus(
                MessageStatus.INFO,
                `${Organization.extensionVersionKey}: ${BaseCommandService.globalState.getGlobalData(Organization.extensionVersionKey, "")}`,
            );
        } catch (error: any) {
            ErrorHandler.handleError(error);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.command),
            );
        }
    }

    static async updateCommand() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register UpdateCommand");
            BaseCommandService.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());
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
                    AuthHelper.getToken(false, "access");
                    break;
                case "bearerToken":
                    AuthHelper.getToken(false, "bearer");
                    break;
            }
        } catch (error: any) {
            throw error;
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.command),
            );
        }
    }

    static async getCurrentExtensionVersion(): Promise<string> {
        const extension = vscode.extensions.getExtension(`${Organization.name}.${Organization.extensionName}`);
        return extension ? extension.packageJSON.version : Organization.baseVersion;
    }
}
