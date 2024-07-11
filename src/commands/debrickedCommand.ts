import * as vscode from "vscode";
import { DebrickedCommands } from "../constants/index";
import { BaseCommandService, HelpService, ScanService } from "../services";
import { Common } from "../helpers";

export class DebrickedCommand {
    public static async commands(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.BASE_COMMAND.command, async () =>
                BaseCommandService.baseCommand(Common.generateHashCode(DebrickedCommands.BASE_COMMAND.command)),
            ),
        );
        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.HELP.command, async () =>
                HelpService.help(Common.generateHashCode(DebrickedCommands.HELP.command)),
            ),
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.SCAN.command, async () =>
                ScanService.scanService(Common.generateHashCode(DebrickedCommands.SCAN.command)),
            ),
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
            const seqToken = Common.generateHashCode("package.json");
            await ScanService.scanService(seqToken);
        }
    }
}
