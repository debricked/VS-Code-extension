import * as vscode from "vscode";
import { DebrickedCommands } from "../constants/index";
import { BaseCommandService, HelpService, ScanService } from "../services";
import { Common, setSeqToken } from "../helpers";

export class DebrickedCommand {
    public static async commands(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.BASE_COMMAND.command, async () => {
                setSeqToken(Common.generateHashCode(DebrickedCommands.BASE_COMMAND.command));
                BaseCommandService.baseCommand();
            }),
        );
        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.HELP.command, async () => {
                setSeqToken(Common.generateHashCode(DebrickedCommands.HELP.command));
                HelpService.help();
            }),
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.SCAN.command, async () => {
                setSeqToken(Common.generateHashCode(DebrickedCommands.SCAN.command));
                ScanService.scanService();
            }),
        );

        // Add file watcher for package.json
        const watcher = vscode.workspace.createFileSystemWatcher("**/package.json");
        watcher.onDidChange(async (e) => {
            await DebrickedCommand.runDebrickedScan(e);
        });

        watcher.onDidCreate(async (e) => {
            await DebrickedCommand.runDebrickedScan(e);
        });

        watcher.onDidDelete(async (e) => {
            await DebrickedCommand.runDebrickedScan(e);
        });

        context.subscriptions.push(watcher);
    }

    static async runDebrickedScan(e: vscode.Uri) {
        if (e.path.endsWith("package.json")) {
            setSeqToken(Common.generateHashCode("package.json"));
            await ScanService.scanService();
        }
    }
}
