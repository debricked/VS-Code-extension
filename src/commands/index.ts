import * as vscode from 'vscode';
import { debrickedCommand } from './debrickedCommand';

const commands = [debrickedCommand];

export const registerCommands = (context: vscode.ExtensionContext) => {
    commands.forEach(command => command.call(this, context));
};