import * as vscode from 'vscode';
import { ORGANIZATION } from '@constants';
import { DEBRICKED_CLI_COMMANDS } from 'src/constants/debricked_cli';
import { generateHashCode } from 'src/helpers/commonHelper';
import { BaseCommandService, HelpService } from '@services';

export async function debrickedCommand(context: vscode.ExtensionContext) {
    const goCliPath = ORGANIZATION.debricked_cli;

    context.subscriptions.push(vscode.commands.registerCommand(DEBRICKED_CLI_COMMANDS.BASE_COMMAND.command, async () => BaseCommandService.baseCommand(goCliPath, generateHashCode(DEBRICKED_CLI_COMMANDS.BASE_COMMAND.command))));
    context.subscriptions.push(vscode.commands.registerCommand(DEBRICKED_CLI_COMMANDS.HELP.command, async () => HelpService.help(goCliPath, generateHashCode(DEBRICKED_CLI_COMMANDS.HELP.command))));
}
