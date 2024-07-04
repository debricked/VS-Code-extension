import * as vscode from 'vscode';
import { logMessage } from './loggerHelper';

export function createAndUseTerminal(description: string, command: string, seqToken: string): vscode.Terminal {
    logMessage(`Executing command: ${command}`, seqToken);
    const terminal = vscode.window.createTerminal(description);
    terminal.sendText(command);
    terminal.show();
    return terminal;
}
