import * as vscode from "vscode";
import { DebrickedCommands, Organization } from "../constants/index";
import { BaseCommandService, HelpService, ScanService } from "../services";
import { Common } from "../helpers";

export class DebrickedCommand {
    public static async commands(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                DebrickedCommands.BASE_COMMAND.command,
                async () =>
                    BaseCommandService.baseCommand(
                        Organization.debricked_cli,
                        Common.generateHashCode(
                            DebrickedCommands.BASE_COMMAND.command,
                        ),
                    ),
            ),
        );
        context.subscriptions.push(
            vscode.commands.registerCommand(
                DebrickedCommands.HELP.command,
                async () =>
                    HelpService.help(
                        Organization.debricked_cli,
                        Common.generateHashCode(DebrickedCommands.HELP.command),
                    ),
            ),
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(
                DebrickedCommands.SCAN.command,
                async () =>
                    ScanService.scanService(
                        Organization.debricked_cli,
                        Common.generateHashCode(DebrickedCommands.SCAN.command),
                    ),
            ),
        );
    }
}
