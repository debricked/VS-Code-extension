import * as vscode from "vscode";
import { DebrickedCommands, MessageStatus } from "../constants/index";
import { BaseCommandService, ScanService, FileService } from "../services";
import { Common, Logger, GlobalStore } from "../helpers";
import { DebrickedCommandNode } from "../types";

export class DebrickedCommand {
    private static globalStore = GlobalStore.getInstance();

    public static async commands(context: vscode.ExtensionContext, progress: any) {
        progress.report({ message: "Registering debricked commands" });
        Logger.logMessageByStatus(MessageStatus.INFO, "Register commands");
        DebrickedCommand.globalStore.setSeqToken(Common.generateHashCode());

        const baseSubCommands: DebrickedCommandNode[] = DebrickedCommands.BASE_COMMAND.sub_commands || [];
        const fileSubCommands: DebrickedCommandNode[] = DebrickedCommands.FILES.sub_commands || [];

        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.BASE_COMMAND.command, async () => {
                await BaseCommandService.baseCommand(context);
            }),
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(baseSubCommands[0].command, async () => {
                await BaseCommandService.installCommand(context);
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
            vscode.commands.registerCommand(DebrickedCommands.SCAN.command, async () => {
                await ScanService.scanService();
            }),
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.FILES.command, async () => {
                await FileService.filesService();
            }),
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(fileSubCommands[0].command, async () => {
                await FileService.findFilesService();
            }),
        );

        // Add file watcher for all files found from 'debricked files find'
        let debrickedData = DebrickedCommand.globalStore.getDebrickedData();

        if (debrickedData && debrickedData.filesToScan) {
            Logger.logMessageByStatus(MessageStatus.INFO, `Found Debricked data`);
        } else {
            await FileService.findFilesService(progress);
            debrickedData = DebrickedCommand.globalStore.getDebrickedData();
            Logger.logMessageByStatus(MessageStatus.INFO, `New Debricked data found:`);
        }

        const filesToScan = await FileService.getFilesToScan();

        if (filesToScan && filesToScan.length > 0) {
            filesToScan.forEach((file: any) => {
                progress.report({ message: `Initializing watcher on ${file}` });
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
        progress.report({ message: `debricked is now ready to use` });
    }
}
