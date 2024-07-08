import * as vscode from "vscode";
import { registerCommands } from "./commands";
import { Common } from "@helpers";

export async function activate(context: vscode.ExtensionContext) {
    Common.checkUserId();
    registerCommands(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
