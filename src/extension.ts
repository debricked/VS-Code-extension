import * as vscode from "vscode";
import { Common } from "@helpers";
import { registerCommands } from "@commands";

export async function activate(context: vscode.ExtensionContext) {
    Common.checkUserId();
    registerCommands(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
