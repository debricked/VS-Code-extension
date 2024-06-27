import * as vscode from 'vscode';
import { helloWorldCommand } from './helloWorldCommand';
const commands = [helloWorldCommand];

export const resgisterCommands = (context: vscode.ExtensionContext) => {
    commands.forEach(command => command.call(this, context));
};