import * as vscode from "vscode";
import { ORGANIZATION } from "@constants";
import { DEBRICKED_CLI_COMMANDS } from "src/constants/debricked_cli";
import { BaseCommandService, HelpService } from "@services";
import { Common } from "@helpers";

export default class DebrickedCommand {
    private static goCliPath = ORGANIZATION.debricked_cli;

    public static async commands(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                DEBRICKED_CLI_COMMANDS.BASE_COMMAND.command,
                async () =>
                    BaseCommandService.baseCommand(
                        DebrickedCommand.goCliPath,
                        Common.generateHashCode(
                            DEBRICKED_CLI_COMMANDS.BASE_COMMAND.command,
                        ),
                    ),
            ),
        );
        context.subscriptions.push(
            vscode.commands.registerCommand(
                DEBRICKED_CLI_COMMANDS.HELP.command,
                async () =>
                    HelpService.help(
                        DebrickedCommand.goCliPath,
                        Common.generateHashCode(
                            DEBRICKED_CLI_COMMANDS.HELP.command,
                        ),
                    ),
            ),
        );
    }
}
