import * as vscode from "vscode";
import { DebrickedCommands, MessageStatus, Organization } from "../constants/index";
import { BaseCommandService, ScanService, FileService } from "../services";
import { Logger, GlobalState, Common, GitHelper } from "../helpers";
import { DebrickedCommandNode } from "../types";
import path from "path";

export class DebrickedCommand {
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }
    public static async commands(context: vscode.ExtensionContext) {
        Logger.logMessageByStatus(MessageStatus.INFO, "Register commands");
        DebrickedCommand.globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());

        const baseSubCommands: DebrickedCommandNode[] = DebrickedCommands.BASE_COMMAND.sub_commands || [];
        const fileSubCommands: DebrickedCommandNode[] = DebrickedCommands.FILES.sub_commands || [];

        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.BASE_COMMAND.command, async () => {
                await BaseCommandService.baseCommand();
            }),
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(baseSubCommands[0].command, async () => {
                DebrickedCommand.globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());
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
        let repoData: any = await DebrickedCommand.globalState.getGlobalData(Organization.REPO_DATA_KEY, {});
        const selectedRepoName = await GitHelper.getRepositoryName();
        if (repoData && repoData[selectedRepoName]?.filesToScan) {
            Logger.logMessageByStatus(MessageStatus.INFO, `Found Debricked data`);
        } else {
            await FileService.findFilesService();
            repoData = await DebrickedCommand.globalState.getGlobalData(Organization.REPO_DATA_KEY, {});
            Logger.logMessageByStatus(MessageStatus.INFO, `New Debricked data found:`);
        }

        const filesToScan = await FileService.getFilesToScan();

        if (filesToScan && filesToScan.length > 0) {
            const filesPattern = new RegExp(filesToScan.map((file: any) => `^${file}$`).join("|"));

            vscode.window.onDidChangeActiveTextEditor((editor) => {
                if (editor && filesPattern.test(path.basename(editor.document.fileName))) {
                    vscode.commands.executeCommand("setContext", "debrickedFilesToScan", true);
                } else {
                    vscode.commands.executeCommand("setContext", "debrickedFilesToScan", false);
                }
            });

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
