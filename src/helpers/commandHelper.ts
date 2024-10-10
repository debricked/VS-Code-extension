import { DebrickedCommands, Messages, MessageStatus, Secrets } from "../constants/index";
import { exec } from "child_process";
import * as vscode from "vscode";
import { promisify } from "util";
import { AuthHelper } from "./authHelper";
import { Logger } from "./loggerHelper";
import * as Sentry from "@sentry/node";

export class Command {
    constructor(
        private authHelper: AuthHelper,
        private logger: typeof Logger,
    ) {}
    public async executeAsyncCommand(command: string, accessTokenRequired = false, sensitive = false): Promise<string> {
        return Sentry.startSpan(
            {
                name: `execute_async_command`,
                op: "command.execute_async",
                startTime: new Date(),
            },
            async (span) => {
                try {
                    const execAsync = promisify(exec);

                    const workspaceFolders = vscode.workspace.workspaceFolders;
                    if (!workspaceFolders) {
                        this.logger.logMessageByStatus(MessageStatus.ERROR, "No workspace folder open");
                        throw new Error("No workspace folder open");
                    }
                    const cwd = workspaceFolders[0].uri.fsPath;

                    if (accessTokenRequired) {
                        const globalFlags = DebrickedCommands.getCommandSpecificFlags("Debricked", true) || [];
                        const accessToken = await this.authHelper.getToken(true, Secrets.ACCESS);

                        if (accessToken) {
                            this.logger.logMessageByStatus(
                                MessageStatus.INFO,
                                `${Messages.CMD_EXEC_WITH_ACCESS_TOKEN}: "${command} "`,
                            );
                            command = `${command} ${globalFlags[0].flag} ${accessToken}`;
                        }
                    } else {
                        this.logger.logMessageByStatus(
                            MessageStatus.INFO,
                            `${Messages.CMD_EXEC_WITHOUT_ACCESS_TOKEN}: "${command}"`,
                        );
                    }

                    const { stdout, stderr } = await execAsync(command, { cwd });
                    if (stderr) {
                        this.logger.logMessageByStatus(MessageStatus.ERROR, `command error: ${stderr}`);
                    }
                    if (!sensitive) {
                        this.logger.logMessageByStatus(MessageStatus.INFO, stdout);
                    }
                    span.end(new Date());
                    return stdout.trim();
                } catch (error: any) {
                    this.logger.logMessageByStatus(MessageStatus.ERROR, `command error: ${error.message}`);
                    this.logger.logError("Error in executeAsyncCommand");
                    throw error;
                }
            },
        );
    }
}
