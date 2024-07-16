import * as vscode from "vscode";
import { DebrickedCommands } from "../constants/index";
import { BaseCommandService, HelpService, ScanService } from "../services";
import { Common, setSeqToken } from "../helpers";

export class DebrickedCommand {
    public static async commands(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.BASE_COMMAND.command, async () => {
                BaseCommandService.baseCommand(context);
            }),
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(
                DebrickedCommands.BASE_COMMAND.sub_commands
                    ? DebrickedCommands.BASE_COMMAND.sub_commands[0].command
                    : "",
                async () => {
                    setSeqToken(
                        Common.generateHashCode(
                            DebrickedCommands.BASE_COMMAND.sub_commands
                                ? DebrickedCommands.BASE_COMMAND.sub_commands[0].command
                                : "",
                        ),
                    );
                    BaseCommandService.installCommand(context);
                },
            ),
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.HELP.command, async () => {
                HelpService.help();
            }),
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(DebrickedCommands.SCAN.command, async () => {
                ScanService.scanService();
            }),
        );

        // Add file watcher for package.json
        const watcher = vscode.workspace.createFileSystemWatcher("**/package.json");
        watcher.onDidChange(async (e) => {
            await ScanService.runDebrickedScan(e);
        });

        watcher.onDidCreate(async (e) => {
            await ScanService.runDebrickedScan(e);
        });

        watcher.onDidDelete(async (e) => {
            await ScanService.runDebrickedScan(e);
        });

        context.subscriptions.push(watcher);
    }
}
