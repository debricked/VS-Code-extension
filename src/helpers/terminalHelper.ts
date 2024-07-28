import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";
import { AuthHelper, Logger } from "../helpers";
import * as vscode from "vscode";

export class Terminal {
    public static async createAndUseTerminal(
        description: string,
        cmdParams: string[] = [],
        accessTokenRequired: boolean = false,
        useDefaultAccessToken: boolean = true,
    ): Promise<vscode.Terminal> {
        let command: string = `${Organization.debrickedCli}`;
        if (accessTokenRequired) {
            const flags = DebrickedCommands.getCommandSpecificFlags("Debricked") || [];
            const accessToken = await AuthHelper.getToken(useDefaultAccessToken, "access");

            if (accessToken) {
                Logger.logMessageByStatus(
                    MessageStatus.INFO,
                    `${Messages.CMD_EXEC_WITH_ACCESS_TOKEN}: "${command} ${cmdParams.join(" ")}"`,
                );
                cmdParams.push(flags[0].flag);
                cmdParams.push(accessToken);
            }
        } else {
            Logger.logMessageByStatus(MessageStatus.INFO, `${Messages.CMD_EXEC_WITHOUT_ACCESS_TOKEN}: "${command}"`);
        }
        command = `${command} ${cmdParams.join(" ")}`;

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
