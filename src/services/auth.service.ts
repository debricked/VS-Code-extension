import { AuthToken, DebrickedCommandNode } from "../types";
import { DebrickedCommands, MessageStatus, Organization, Secrets } from "../constants";
import { authHelper, commandHelper, commonHelper, errorHandler, Logger, statusBarMessageHelper } from "../helpers";

export class AuthService {
    constructor(private command: DebrickedCommandNode = DebrickedCommands.AUTH) {
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.fetchToken = this.fetchToken.bind(this);
    }

    public async login(updateCredentials = true) {
        try {
            if (updateCredentials) {
                Logger.logMessageByStatus(MessageStatus.INFO, "Authentication: Login");

                const cmdParams: string[] = [];
                if (this.command.sub_commands) {
                    cmdParams.push(this.command.cli_command, this.command.sub_commands[0].cli_command);
                }

                const output = await commandHelper.executeAsyncCommand(
                    `${Organization.debrickedCli} ${cmdParams.join(" ")}`,
                    false,
                );

                if (output.includes("Successfully authenticated")) {
                    statusBarMessageHelper.showInformationMessage("Authentication successful");
                    Logger.logMessageByStatus(MessageStatus.INFO, "Authentication successful");

                    await commonHelper.wait(5000);

                    const token: AuthToken = this.extractToken(await this.fetchToken());
                    const newBearerToken = `Bearer ${token.access_token}`;
                    await authHelper.setToken(Secrets.BEARER, newBearerToken);
                } else {
                    statusBarMessageHelper.showErrorMessage("Authentication failed");
                    Logger.logMessageByStatus(MessageStatus.INFO, "Authentication failed");
                }
            }
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

    public async fetchToken(): Promise<any> {
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

            const tokens: any = await commandHelper.executeAsyncCommand(
                `${Organization.debrickedCli} ${cmdParams.join(" ")}`,
                false,
                true,
            );

            Logger.logMessageByStatus(MessageStatus.INFO, "Successfully fetched token");
            return tokens;
        } catch (error: any) {
            errorHandler.handleError(error, "Please Login to fetch token or something went wrong");
            return error;
        }
    }

    public extractToken(token: any): AuthToken {
        // Check if the token string contains 'access_token'
        if (token.includes("access_token")) {
            // Regular expression to match the JSON object
            const jsonMatch = token.match(/\{.*\}/);

            if (jsonMatch) {
                const jsonString = jsonMatch[0];
                try {
                    const jsonObject: AuthToken = JSON.parse(jsonString); // Convert to JSON object
                    return jsonObject; // Return the parsed JSON object
                } catch (error: any) {
                    throw new Error("Invalid JSON format: " + error.message);
                }
            } else {
                throw new Error("No JSON found in the token string.");
            }
        } else {
            throw new Error("'access_token' string not found in the token.");
        }
    }
}
