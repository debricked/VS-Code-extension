import * as vscode from "vscode";
import { DebrickedCommands } from "../constants/index";
import { BaseCommandService, ScanService, FileService, AuthService } from "../services";
import { Logger, SentryHelper, errorHandler } from "../helpers";

export class DebrickedCommand {
    public static async commands(context: vscode.ExtensionContext) {
        try {
            Logger.logInfo("Started registering commands");

            const baseSubCommands = DebrickedCommands.BASE_COMMAND.sub_commands;
            const fileSubCommands = DebrickedCommands.FILES.sub_commands;
            const authSubCommands = DebrickedCommands.AUTH.sub_commands;

            // Register base command
            DebrickedCommand.registerCommand(
                context,
                DebrickedCommands.BASE_COMMAND.command,
                BaseCommandService.baseCommand,
            );

            // Register base sub-commands
            if (baseSubCommands) {
                DebrickedCommand.registerCommand(context, baseSubCommands[0].command, async () => {
                    await BaseCommandService.installCommand();
                });
                DebrickedCommand.registerCommand(context, baseSubCommands[1].command, BaseCommandService.updateCommand);
                DebrickedCommand.registerCommand(context, baseSubCommands[2].command, BaseCommandService.help);
                DebrickedCommand.registerCommand(context, baseSubCommands[3].command, Logger.openLogFile);
                DebrickedCommand.registerCommand(context, baseSubCommands[4].command, BaseCommandService.login);
                DebrickedCommand.registerCommand(context, baseSubCommands[5].command, SentryHelper.reConfigureSentry);
            }

            //Register auth sub-commands
            if (authSubCommands) {
                SentryHelper.setTransactionName("Auth Service");
                DebrickedCommand.registerCommand(context, authSubCommands[0].command, AuthService.login);
                DebrickedCommand.registerCommand(context, authSubCommands[1].command, AuthService.logout);
                DebrickedCommand.registerCommand(context, authSubCommands[2].command, AuthService.token);
            }

            // Register scan command
            DebrickedCommand.registerCommand(context, DebrickedCommands.SCAN.command, ScanService.scanService);

            // Register files command
            DebrickedCommand.registerCommand(context, DebrickedCommands.FILES.command, FileService.filesService);

            // Register file sub-commands
            if (fileSubCommands) {
                DebrickedCommand.registerCommand(context, fileSubCommands[0].command, FileService.findFilesService);
            }
        } catch (error) {
            errorHandler.handleError(error);
        } finally {
            Logger.logInfo("Command registration has been completed");
        }
    }

    private static registerCommand(
        context: vscode.ExtensionContext,
        command: string,
        callback: (...args: any[]) => any,
    ) {
        context.subscriptions.push(vscode.commands.registerCommand(command, callback));
    }
}
