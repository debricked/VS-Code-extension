import * as vscode from 'vscode';
import { helloWorldCommand } from './helloWorldCommand';
const commands = [helloWorldCommand];

export const registerCommands = (context: vscode.ExtensionContext) => {
    commands.forEach(command => command.call(this, context));
};