import * as vscode from "vscode";
import { DebrickedCommands, MessageStatus, Organization } from "../constants/index";
import { BaseCommandService, ScanService, FileService } from "../services";
import { Logger, GlobalState, Common, StatusBarMessageHelper } from "../helpers";
import { DebrickedCommandNode } from "../types";

export class DebrickedCommand {
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }
    public static async commands(context: vscode.ExtensionContext) {
        try {
            Logger.logInfo("Started registering commands");
            DebrickedCommand.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());

            const baseSubCommands: DebrickedCommandNode[] | undefined = DebrickedCommands.BASE_COMMAND.sub_commands;
            const fileSubCommands: DebrickedCommandNode[] | undefined = DebrickedCommands.FILES.sub_commands;

            context.subscriptions.push(
                vscode.commands.registerCommand(DebrickedCommands.BASE_COMMAND.command, async () => {
                    await BaseCommandService.baseCommand();
                }),
            );

            if (baseSubCommands) {
                context.subscriptions.push(
                    vscode.commands.registerCommand(baseSubCommands[0].command, async () => {
                        DebrickedCommand.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());
                        await BaseCommandService.installCommand();
                    }),
                );

                context.subscriptions.push(
                    vscode.commands.registerCommand(baseSubCommands[1].command, async () => {
                        await BaseCommandService.updateCommand();
                    }),
                );

                context.subscriptions.push(
                    vscode.commands.registerCommand(baseSubCommands[2].command, async () => {
                        await BaseCommandService.help();
                    }),
                );

                context.subscriptions.push(
                    vscode.commands.registerCommand(baseSubCommands[3].command, async () => {
                        await Logger.openLogFile();
                    }),
                );
            }

            context.subscriptions.push(
                vscode.commands.registerCommand(DebrickedCommands.SCAN.command, async () => {
                    await ScanService.scanService();
                }),
            );

            context.subscriptions.push(
                vscode.commands.registerCommand(DebrickedCommands.FILES.command, async () => {
                    await FileService.filesService();
                }),
            );

            if (fileSubCommands) {
                context.subscriptions.push(
                    vscode.commands.registerCommand(fileSubCommands[0].command, async () => {
                        await FileService.findFilesService();
                    }),
                );
            }

            // Add file watcher for all files found from 'debricked files find'
            await ScanService.addWatcherToManifestFiles((await FileService.findFilesService()) || [], context);
        } catch (error: any) {
            StatusBarMessageHelper.showErrorMessage(`${Organization.name} - ${MessageStatus.ERROR}: ${error.message}`);
            Logger.logError(`Error: ${error.stack}`);
        } finally {
            Logger.logInfo("command register has been completed");
        }
    }
}
