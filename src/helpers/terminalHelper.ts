import { Logger } from "@helpers";
import * as vscode from "vscode";

export default class Terminal {
    public static createAndUseTerminal(
        description: string,
        command: string,
        seqToken: string,
    ): vscode.Terminal {
        Logger.logMessage(`Executing command: ${command}`, seqToken);
        const terminal = vscode.window.createTerminal(description);
        terminal.sendText(command);
        terminal.show();
        return terminal;
    }
}
