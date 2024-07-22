import * as vscode from "vscode";
import { DebrickedCommands, MessageStatus } from "../constants/index";
import { BaseCommandService, HelpService, ScanService, FileService } from "../services";
import { Common, Logger, GlobalStore } from "../helpers";

export class DebrickedCommand {
    private static globalStore = GlobalStore.getInstance();
    public static async commands(context: vscode.ExtensionContext) {
        Logger.logMessageByStatus(MessageStatus.INFO, "Register commands");

        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.BASE_COMMAND.command, async () => {
                await BaseCommandService.baseCommand(context);
            }),
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(
                DebrickedCommands.BASE_COMMAND.sub_commands
                    ? DebrickedCommands.BASE_COMMAND.sub_commands[0].command
                    : "",
                async () => {
                    DebrickedCommand.globalStore.setSeqToken(Common.generateHashCode());
                    await BaseCommandService.installCommand(context);
                },
            ),
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.HELP.command, async () => {
                await HelpService.help();
            }),
        );

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

        const findFilesCommand = DebrickedCommands.FILES.sub_commands
            ? DebrickedCommands.FILES.sub_commands[0].command
            : "";
        context.subscriptions.push(
            vscode.commands.registerCommand(findFilesCommand, async () => {
                await FileService.findFilesService();
            }),
        );

        // Add file watcher for all files found from 'debricked files find'
        let debrickedData = DebrickedCommand.globalStore.getDebrickedData();

        if (debrickedData && debrickedData.filesToScan) {
            Logger.logMessageByStatus(MessageStatus.INFO, `Found Debricked data`);
        } else {
            await FileService.findFilesService();
            debrickedData = DebrickedCommand.globalStore.getDebrickedData();
            Logger.logMessageByStatus(MessageStatus.INFO, `New Debricked data found:`);
        }

        const filesToScan = await FileService.getFilesToScan();

        if (filesToScan && filesToScan.length > 0) {
            filesToScan.forEach((file: any) => {
                const watcher = vscode.workspace.createFileSystemWatcher(`**/${file}`);

                const runScan = async (e: vscode.Uri) => {
                    await ScanService.runDebrickedScan(e);
                };

                watcher.onDidChange(runScan);
                watcher.onDidCreate(runScan);
                watcher.onDidDelete(runScan);
                Logger.logMessageByStatus(MessageStatus.INFO, `register watcher on ${file}`);
                context.subscriptions.push(watcher);
            });
        }
    }
}
