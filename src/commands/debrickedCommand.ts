import * as vscode from "vscode";
import { DebrickedCommands, Organization } from "../constants/index";
import { BaseCommandService, ScanService, FileService } from "../services";
import { Logger, GlobalState, Common, ErrorHandler } from "../helpers";

export class DebrickedCommand {
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }
    public static async commands(context: vscode.ExtensionContext) {
        try {
            Logger.logInfo("Started registering commands");
            DebrickedCommand.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());

            const baseSubCommands = DebrickedCommands.BASE_COMMAND.sub_commands;
            const fileSubCommands = DebrickedCommands.FILES.sub_commands;

            // Register base command
            this.registerCommand(context, DebrickedCommands.BASE_COMMAND.command, BaseCommandService.baseCommand);

            // Register base sub-commands
            if (baseSubCommands) {
                this.registerCommand(context, baseSubCommands[0].command, async () => {
                    DebrickedCommand.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());
                    await BaseCommandService.installCommand();
                });
                this.registerCommand(context, baseSubCommands[1].command, BaseCommandService.updateCommand);
                this.registerCommand(context, baseSubCommands[2].command, BaseCommandService.help);
                this.registerCommand(context, baseSubCommands[3].command, Logger.openLogFile);
            }

            // Register scan command
            this.registerCommand(context, DebrickedCommands.SCAN.command, ScanService.scanService);

            // Register files command
            this.registerCommand(context, DebrickedCommands.FILES.command, FileService.filesService);

            // Register file sub-commands
            if (fileSubCommands) {
                this.registerCommand(context, fileSubCommands[0].command, FileService.findFilesService);
            }

            // Add file watcher for all files found from 'debricked files find'
            const foundFiles = (await FileService.findFilesService()) || [];
            await ScanService.addWatcherToManifestFiles(foundFiles, context);
        } catch (error) {
            ErrorHandler.handleError(error);
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
