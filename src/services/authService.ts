import { DebrickedCommandNode, AuthToken } from "../types";
import { DebrickedCommands, MessageStatus, Organization } from "../constants";
import { commandHelper, errorHandler, Logger, statusBarMessageHelper } from "../helpers";

export class AuthService {
    static async login() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Authentication: Login");

            const cmdParams: string[] = [];
            const command: DebrickedCommandNode = DebrickedCommands.AUTH;
            if (command.sub_commands) {
                cmdParams.push(command.cli_command, command.sub_commands[0].cli_command);
            }

            const cmdOutput = await commandHelper.executeAsyncCommand(
                `${Organization.debrickedCli} ${cmdParams.join(" ")}`,
                false,
            );

            if (!cmdOutput.includes("Successfully authenticated")) {
                throw new Error("Authentication Failed");
            }

            statusBarMessageHelper.showInformationMessage("Authentication successful");
            Logger.logMessageByStatus(MessageStatus.INFO, "Authentication successful");
        } catch (error: any) {
            errorHandler.handleError(error);
        }
    }

    static async logout() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Authentication: Logout");

            const cmdParams: string[] = [];
            const command: DebrickedCommandNode = DebrickedCommands.AUTH;
            if (command.sub_commands) {
                cmdParams.push(command.cli_command, command.sub_commands[1].cli_command);
            }

            const cmdOutput = await commandHelper.executeAsyncCommand(
                `${Organization.debrickedCli} ${cmdParams.join(" ")}`,
                false,
            );

            if (!cmdOutput.includes("Successfully removed credentials")) {
                throw new Error("Logout Failed");
            }

            statusBarMessageHelper.showInformationMessage("Successfully logged out");
            Logger.logMessageByStatus(MessageStatus.INFO, "Successfully logged out");
        } catch (error: any) {
            errorHandler.handleError(error);
        }
    }

    static async token() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Authentication: Token");

            const cmdParams: string[] = [];
            const command: DebrickedCommandNode = DebrickedCommands.AUTH;
            if (command.sub_commands && command.sub_commands[2].flags) {
                cmdParams.push(
                    command.cli_command,
                    command.sub_commands[2].cli_command,
                    command.sub_commands[2].flags[0].flag,
                );
            }

            const tokens: AuthToken = JSON.parse(
                await commandHelper.executeAsyncCommand(`${Organization.debrickedCli} ${cmdParams.join(" ")}`, false),
            );
            Logger.logMessageByStatus(MessageStatus.INFO, "Successfully fetched token");
        } catch (error: any) {
            error.message = "Please Login to fetch token";
            errorHandler.handleError(error);
        }
    }
}
