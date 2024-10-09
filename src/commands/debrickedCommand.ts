import * as vscode from "vscode";
import { DebrickedCommands } from "../constants/index";
import { baseCommandService, scanService, authService } from "../services";
import { Logger, SentryHelper, errorHandler } from "../helpers";

export class DebrickedCommand {
    public async commands(context: vscode.ExtensionContext) {
        try {
            Logger.logInfo("Started registering commands");

            const baseSubCommands = DebrickedCommands.BASE_COMMAND.sub_commands;
            const authSubCommands = DebrickedCommands.AUTH.sub_commands;

            // Register base command
            this.registerCommand(context, DebrickedCommands.BASE_COMMAND.command, baseCommandService.baseCommand);

            // Register base sub-commands
            if (baseSubCommands) {
                this.registerCommand(context, baseSubCommands[0].command, async () => {
                    await baseCommandService.installCommand();
                });
                this.registerCommand(context, baseSubCommands[1].command, baseCommandService.updateCommand);
                this.registerCommand(context, baseSubCommands[2].command, baseCommandService.help);
                this.registerCommand(context, baseSubCommands[3].command, Logger.openLogFile);
                this.registerCommand(context, baseSubCommands[4].command, baseCommandService.login);
                this.registerCommand(context, baseSubCommands[5].command, SentryHelper.reConfigureSentry);
            }

            //Register auth sub-commands
            if (authSubCommands) {
                SentryHelper.setTransactionName("Auth Service");
                this.registerCommand(context, authSubCommands[0].command, authService.login);
                this.registerCommand(context, authSubCommands[1].command, authService.logout);
                this.registerCommand(context, authSubCommands[2].command, authService.token);
            }

            // Register scan command
            this.registerCommand(context, DebrickedCommands.SCAN.command, scanService.scan);
        } catch (error) {
            errorHandler.handleError(error);
        } finally {
            Logger.logInfo("Command registration has been completed");
        }
    }

    private registerCommand(context: vscode.ExtensionContext, command: string, callback: (...args: any[]) => any) {
        context.subscriptions.push(vscode.commands.registerCommand(command, callback));
    }
}
