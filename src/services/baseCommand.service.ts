import { DebrickedCommandNode } from "../types";
import { DebrickedCommands, Messages, MessageStatus, Organization, Secrets, UserResponse } from "../constants/index";
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
    SentryHelper,
} from "../helpers";
import * as vscode from "vscode";
import { AuthService } from "./auth.service";

export class BaseCommandService {
    constructor() {
        this.baseCommand = this.baseCommand.bind(this);
        this.getCurrentExtensionVersion = this.getCurrentExtensionVersion.bind(this);
        this.help = this.help.bind(this);
        this.installCommand = this.installCommand.bind(this);
        this.updateCommand = this.updateCommand.bind(this);
    }
    public async baseCommand() {
        try {
            const authService = new AuthService();
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
                    authService.login(true);
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
            SentryHelper.setTransactionName("Install CLI");
            Logger.logMessageByStatus(MessageStatus.INFO, "Register InstallCommand");

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

    public async updateCommand() {
        try {
            SentryHelper.setTransactionName("Update Token");
            Logger.logMessageByStatus(MessageStatus.INFO, "Register UpdateCommand");
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
                    authHelper.getToken(false, Secrets.ACCESS);
                    break;
                case "bearerToken":
                    authHelper.getToken(false, Secrets.BEARER);
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

    public async reset() {
        try {
            SentryHelper.setTransactionName("Reset Debricked");
            Logger.logMessageByStatus(MessageStatus.INFO, "Register ResetCommand");

            const response = await statusBarMessageHelper.showWarningMessageWithItems(
                "Do you want to reset Debricked?",
                [UserResponse.YES, UserResponse.NO],
            );
            if (response === UserResponse.YES) {
                await globalStore.getGlobalStateInstance()?.resetDebrickedData();
                statusBarMessageHelper.showInformationMessage(Messages.RESET_SUCCESS);
                SentryHelper.captureMessage("Reset Debricked");
            }
        } catch (error: any) {
            errorHandler.handleError(error);
        }
    }
    public async getCurrentExtensionVersion(): Promise<string> {
        const extension = vscode.extensions.getExtension(`${Organization.name}.${Organization.packageJson.name}`);
        return extension ? extension.packageJSON.version : Organization.packageJson.version;
    }
}
