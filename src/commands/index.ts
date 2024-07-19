import * as vscode from "vscode";
import { DebrickedCommand } from "./debrickedCommand";

const commands = [DebrickedCommand.commands];

export const registerCommands = async (context: vscode.ExtensionContext) => {
    await commands.forEach((command) => command.call(this, context));
};
