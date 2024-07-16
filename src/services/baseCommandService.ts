import { DebrickedCommandNode } from "../types";
import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";
import { StatusBarMessageHelper, Terminal, StatusMessage, Logger, QuickPick, InstallHelper } from "../helpers";
import * as vscode from "vscode";

export class BaseCommandService {
    static async baseCommand(context: vscode.ExtensionContext) {
        try {
            const subCommand: DebrickedCommandNode[] | undefined = DebrickedCommands.BASE_COMMAND.sub_commands;

            let selectedSubCommand: any;
            if (subCommand) {
                selectedSubCommand = await QuickPick.showQuickPick(subCommand, Messages.QUICK_PICK_FLAG);
            }

            if (selectedSubCommand && selectedSubCommand.cli_command === "install") {
                BaseCommandService.installCommand(context);
            } else {
                StatusBarMessageHelper.setStatusBarMessage(
                    StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.HELP.cli_command),
                );
                Terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description);
                StatusBarMessageHelper.setStatusBarMessage(
                    StatusMessage.getStatusMessage(MessageStatus.COMPLETE, DebrickedCommands.HELP.cli_command),
                );
            }
        } catch (error: any) {
            StatusBarMessageHelper.showErrorMessage(
                `${Organization.name} - ${DebrickedCommands.HELP.cli_command} ${MessageStatus.ERROR}: ${error.message}`,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.HELP.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.ERROR, error);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.HELP.cli_command),
            );
        }
    }

    static async installCommand(context: vscode.ExtensionContext) {
        try {
            const currentVersion = await BaseCommandService.getCurrentExtensionVersion();
            const installer = new InstallHelper();
            Logger.logMessageByStatus(
                MessageStatus.INFO,
                `${Organization.IS_FIRST_ACTIVATION_KEY}: ${context.globalState.get<boolean>(Organization.IS_FIRST_ACTIVATION_KEY)} - ${Organization.EXTENSION_VERSION_KEY}: ${currentVersion}`,
            );

            installer.runInstallScript().then(() => {
                context.globalState.update(Organization.IS_FIRST_ACTIVATION_KEY, false);
                context.globalState.update(Organization.EXTENSION_VERSION_KEY, currentVersion);

                Logger.logMessageByStatus(
                    MessageStatus.INFO,
                    `${Organization.EXTENSION_VERSION_KEY}: ${context.globalState.get<boolean>(Organization.EXTENSION_VERSION_KEY)}`,
                );
            });
        } catch (error: any) {
            StatusBarMessageHelper.showErrorMessage(
                `${Organization.name} - ${DebrickedCommands.BASE_COMMAND.command} ${MessageStatus.ERROR}: ${error.message}`,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.BASE_COMMAND.command),
            );
            Logger.logMessageByStatus(MessageStatus.ERROR, error);
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
