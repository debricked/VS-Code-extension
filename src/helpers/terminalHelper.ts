import { DebrickedCommands, Messages, Organization } from "../constants/index";
import { AuthHelper, Logger } from "../helpers";
import * as vscode from "vscode";

export class Terminal {
    public static async createAndUseTerminal(
        description: string,
        cmdParams: string[] = [],
        accessTokenRequired: boolean = false,
    ): Promise<vscode.Terminal> {
        let command: string = `${Organization.debricked_cli}`;
        if (accessTokenRequired) {
            const flags = DebrickedCommands.getCommandSpecificFlags("Debricked") || [];
            const accessToken = await AuthHelper.getAccessToken();

            if (accessToken) {
                cmdParams.push(flags[0].flag);
                cmdParams.push(accessToken);
                command = `${command} ${cmdParams.join(" ")}`;
                Logger.logMessage(Messages.CMD_EXEC_WITH_ACCESS_TOKEN);
            }
        } else {
            command = `${command} ${cmdParams.join(" ")}`;
            Logger.logMessage(`${Messages.CMD_EXEC_WITHOUT_ACCESS_TOKEN}: ${command}`);
        }

        let terminal: vscode.Terminal;
        if (vscode.window.activeTerminal) {
            terminal = vscode.window.activeTerminal;
        } else {
            terminal = vscode.window.createTerminal(description);
        }

        terminal.sendText(command);
        terminal.show();
        return terminal;
    }
}
