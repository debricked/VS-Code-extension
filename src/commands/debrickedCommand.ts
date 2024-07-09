import * as vscode from "vscode";
import { DebrickedCommands, Organization } from "../constants";
import { BaseCommandService, HelpService } from "../services";
import { Common } from "../helpers";

export default class DebrickedCommand {
    private static goCliPath = Organization.debricked_cli;

    public static async commands(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                DebrickedCommands.BASE_COMMAND.command,
                async () =>
                    BaseCommandService.baseCommand(
                        DebrickedCommand.goCliPath,
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
                        DebrickedCommand.goCliPath,
                        Common.generateHashCode(DebrickedCommands.HELP.command),
                    ),
            ),
        );
    }
}
