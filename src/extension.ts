import * as vscode from "vscode";
import { Common } from "./helpers";
import { registerCommands } from "./commands";
import { DebrickedCommandsTreeDataProvider } from "./providers";

export async function activate(context: vscode.ExtensionContext) {
    Common.checkUserId();
    registerCommands(context);

    const debCommandsProvider = new DebrickedCommandsTreeDataProvider();
    vscode.window.registerTreeDataProvider("debrickedCommands", debCommandsProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
