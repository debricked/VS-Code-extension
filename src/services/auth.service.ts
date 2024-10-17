import { DebrickedCommandNode, AuthToken } from "../types";
import { DebrickedCommands, MessageStatus, Organization } from "../constants";
import { commandHelper, errorHandler, Logger, statusBarMessageHelper } from "../helpers";

export class AuthService {
    constructor(private command: DebrickedCommandNode = DebrickedCommands.AUTH) {
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.token = this.token.bind(this);
    }

    public async login() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Authentication: Login");

            const cmdParams: string[] = [];
            if (this.command.sub_commands) {
                cmdParams.push(this.command.cli_command, this.command.sub_commands[0].cli_command);
            }

            await commandHelper.executeAsyncCommand(`${Organization.debrickedCli} ${cmdParams.join(" ")}`, false);

            statusBarMessageHelper.showInformationMessage("Authentication successful");
            Logger.logMessageByStatus(MessageStatus.INFO, "Authentication successful");
        } catch (error: any) {
            errorHandler.handleError(error, "Authentication Failed");
        }
    }

    public async logout() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Authentication: Logout");

            const cmdParams: string[] = [];
            if (this.command.sub_commands) {
                cmdParams.push(this.command.cli_command, this.command.sub_commands[1].cli_command);
            }

            await commandHelper.executeAsyncCommand(`${Organization.debrickedCli} ${cmdParams.join(" ")}`, false);

            statusBarMessageHelper.showInformationMessage("Successfully logged out");
            Logger.logMessageByStatus(MessageStatus.INFO, "Successfully logged out");
        } catch (error: any) {
            errorHandler.handleError(error, "Logout Failed");
        }
    }

    public async token(): Promise<AuthToken> {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Authentication: Token");

            const cmdParams: string[] = [];
            if (this.command.sub_commands && this.command.sub_commands[2].flags) {
                cmdParams.push(
                    this.command.cli_command,
                    this.command.sub_commands[2].cli_command,
                    this.command.sub_commands[2].flags[0].flag,
                );
            }

            const tokens: AuthToken = JSON.parse(
                await commandHelper.executeAsyncCommand(
                    `${Organization.debrickedCli} ${cmdParams.join(" ")}`,
                    false,
                    true,
                ),
            );
            Logger.logMessageByStatus(MessageStatus.INFO, "Successfully fetched token");

            return tokens;
        } catch (error: any) {
            errorHandler.handleError(error, "Please Login to fetch token or something went wrong");
            return error;
        }
    }
}
