import * as vscode from 'vscode';
import { COMMANDS } from '../constants';

export async function helloWorldCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand(COMMANDS.HELLO_WORLD, async () => {
        vscode.window.showInformationMessage('Hello World from debricked!');
    }));
}
