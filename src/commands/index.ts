import * as vscode from "vscode";
import { DebrickedCommand } from "./debrickedCommand";

const commands = [DebrickedCommand.commands];

export const registerCommands = (context: vscode.ExtensionContext) => {
    commands.forEach((command) => command.call(this, context));
};
