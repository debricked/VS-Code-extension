import { DebrickedCommands, Messages, MessageStatus, Organization, TokenType } from "../constants/index";
import { AuthHelper } from "./authHelper";
import { Logger } from "./loggerHelper";

import * as vscode from "vscode";

export class Terminal {
    constructor(
        private authHelper: AuthHelper,
        private logger: typeof Logger,
    ) {}

    public async createAndUseTerminal(
        description: string,
        cmdParams: string[] = [],
        accessTokenRequired: boolean = false,
        useDefaultAccessToken: boolean = true,
    ): Promise<vscode.Terminal> {
        let command: string = Organization.debrickedCli;
        if (accessTokenRequired) {
            const flags = DebrickedCommands.getCommandSpecificFlags("Debricked") || [];
            const accessToken = await this.authHelper.getToken(useDefaultAccessToken, TokenType.ACCESS);

            if (accessToken) {
                this.logger.logMessageByStatus(
                    MessageStatus.INFO,
                    `${Messages.CMD_EXEC_WITH_ACCESS_TOKEN}: "${command} ${cmdParams.join(" ")}"`,
                );
                cmdParams.push(flags[0].flag);
                cmdParams.push(accessToken);
            }
        } else {
            this.logger.logMessageByStatus(
                MessageStatus.INFO,
                `${Messages.CMD_EXEC_WITHOUT_ACCESS_TOKEN}: "${command}"`,
            );
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
