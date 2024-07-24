import { DebrickedCommandNode } from "../types";
import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";
import { StatusBarMessageHelper, Terminal, StatusMessage, Logger, QuickPick, InstallHelper, Common } from "../helpers";
import * as vscode from "vscode";
import { GlobalState } from "helpers/globalState";

export class BaseCommandService {
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }

    static async baseCommand() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register BaseCommand");
            BaseCommandService.globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());
            const subCommand: DebrickedCommandNode[] | undefined = DebrickedCommands.BASE_COMMAND.sub_commands;

            let selectedSubCommand: any;
            if (subCommand) {
                selectedSubCommand = await QuickPick.showQuickPick(subCommand, Messages.QUICK_PICK_FLAG);
            }

            switch (selectedSubCommand.cli_command) {
                case "install":
                    BaseCommandService.installCommand();
                    break;

                case "access_token":
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
            StatusBarMessageHelper.showErrorMessage(
                `${Organization.name} - ${DebrickedCommands.BASE_COMMAND.cli_command} ${MessageStatus.ERROR}: ${error.message}`,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.BASE_COMMAND.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.ERROR, error.stack);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.cli_command),
            );
        }
    }

    static async help() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register HelpCommand");
            BaseCommandService.globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());
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
            StatusBarMessageHelper.showErrorMessage(
                `${Organization.name} - ${DebrickedCommands.BASE_COMMAND.cli_command} ${MessageStatus.ERROR}: ${error.message}`,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.BASE_COMMAND.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.ERROR, error.stack);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.cli_command),
            );
        }
    }

    static async installCommand() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register InstallCommand");
            BaseCommandService.globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());

            const currentVersion = await BaseCommandService.getCurrentExtensionVersion();
            const installer = new InstallHelper();
            Logger.logMessageByStatus(
                MessageStatus.INFO,
                `${Organization.IS_FIRST_ACTIVATION_KEY}: ${BaseCommandService.globalState.getGlobalData(Organization.IS_FIRST_ACTIVATION_KEY, "")} - ${Organization.EXTENSION_VERSION_KEY}: ${currentVersion}`,
            );

            await installer.runInstallScript();
            BaseCommandService.globalState.setGlobalData(Organization.IS_FIRST_ACTIVATION_KEY, false);
            BaseCommandService.globalState.setGlobalData(Organization.EXTENSION_VERSION_KEY, currentVersion);

            Logger.logMessageByStatus(
                MessageStatus.INFO,
                `${Organization.EXTENSION_VERSION_KEY}: ${BaseCommandService.globalState.getGlobalData(Organization.EXTENSION_VERSION_KEY, "")}`,
            );
        } catch (error: any) {
            StatusBarMessageHelper.showErrorMessage(
                `${Organization.name} - ${DebrickedCommands.BASE_COMMAND.command} ${MessageStatus.ERROR}: ${error.message}`,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.BASE_COMMAND.command),
            );
            Logger.logMessageByStatus(MessageStatus.ERROR, error.stack);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.command),
            );
        }
    }

    static async updateCommand() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register UpdateCommand");
            BaseCommandService.globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());

            Terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description, [], true, false);
        } catch (error: any) {
            StatusBarMessageHelper.showErrorMessage(
                `${Organization.name} - ${DebrickedCommands.BASE_COMMAND.command} ${MessageStatus.ERROR}: ${error.message}`,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.BASE_COMMAND.command),
            );
            Logger.logMessageByStatus(MessageStatus.ERROR, error.stack);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.BASE_COMMAND.command),
            );
        }
    }

    static async getCurrentExtensionVersion(): Promise<string> {
        const extension = vscode.extensions.getExtension(`${Organization.name}.${Organization.extension_name}`);
        return extension ? extension.packageJSON.version : Organization.base_version;
    }
}
