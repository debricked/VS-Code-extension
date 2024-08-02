import * as vscode from "vscode";
import { DebrickedCommands } from "../constants/index";
import { BaseCommandService, ScanService, FileService } from "../services";
import { Logger, errorHandler, globalStore } from "../helpers";

export class DebrickedCommand {
    public static async commands(context: vscode.ExtensionContext) {
        try {
            Logger.logInfo("Started registering commands");

            globalStore.setSequenceID();
            const baseSubCommands = DebrickedCommands.BASE_COMMAND.sub_commands;
            const fileSubCommands = DebrickedCommands.FILES.sub_commands;

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
