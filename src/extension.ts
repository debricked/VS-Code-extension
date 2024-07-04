import * as vscode from "vscode";
import { registerCommands } from "./commands";
import { checkUserId } from "./helpers/commonHelper";

export async function activate(context: vscode.ExtensionContext) {
    checkUserId();

    registerCommands(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
