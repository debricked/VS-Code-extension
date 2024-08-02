import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";
import { execFile, exec } from "child_process";
import * as vscode from "vscode";
import { promisify } from "util";
import { ErrorHandler } from "./errorHandler";
import { AuthHelper } from "./authHelper";
import { Logger } from "./loggerHelper";

export class Command {
    constructor(
        private errorHandler: ErrorHandler,
        private authHelper: AuthHelper,
        private logger: typeof Logger,
    ) {}
    public async executeCommand(cmdParams: string[] = [], accessTokenRequired: boolean = false): Promise<string> {
        try {
            if (accessTokenRequired) {
                const flags = DebrickedCommands.getCommandSpecificFlags("Debricked") || [];
                const accessToken = await this.authHelper.getToken(true, Organization.access);

                if (accessToken) {
                    cmdParams.push(flags[0].flag);
                    cmdParams.push(accessToken);
                    this.logger.logMessageByStatus(
                        MessageStatus.INFO,
                        `${Messages.CMD_EXEC_WITH_ACCESS_TOKEN}: ${cmdParams.join(" ")}`,
                    );
                }
            } else {
                this.logger.logMessageByStatus(
                    MessageStatus.INFO,
                    `${Messages.CMD_EXEC_WITHOUT_ACCESS_TOKEN}: ${cmdParams.join(" ")}`,
                );
            }

            this.logger.logInfo(`Executing command: ${Organization.debrickedCli} ${cmdParams.join(" ")}`);
            return await new Promise((resolve, reject) => {
                execFile(Organization.debrickedCli, cmdParams, (error: any, stdout: string, stderr: string) => {
                    if (error) {
                        this.logger.logMessageByStatus(MessageStatus.ERROR, error.message);
                        reject(new Error(stderr));
                    } else {
                        this.logger.logMessageByStatus(MessageStatus.FINISHED, stdout);
                        resolve(stdout);
                    }
                });
            });
        } catch (error: any) {
            this.errorHandler.handleError(error);
            throw error;
        }
    }

    public async executeAsyncCommand(command: string, accessTokenRequired: boolean = false): Promise<string> {
        try {
            const execAsync = promisify(exec);

            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                this.logger.logMessageByStatus(MessageStatus.ERROR, "No workspace folder open");
                throw new Error("No workspace folder open");
            }
            const cwd = workspaceFolders[0].uri.fsPath;

            if (accessTokenRequired) {
                const flags = DebrickedCommands.getCommandSpecificFlags("Debricked") || [];
                const accessToken = await this.authHelper.getToken(true, Organization.access);

                if (accessToken) {
                    command = `${command} ${flags[0].flag} ${accessToken}`;
                    this.logger.logMessageByStatus(
                        MessageStatus.INFO,
                        `${Messages.CMD_EXEC_WITH_ACCESS_TOKEN}: "${command} "`,
                    );
                }
            } else {
                this.logger.logMessageByStatus(
                    MessageStatus.INFO,
                    `${Messages.CMD_EXEC_WITHOUT_ACCESS_TOKEN}: "${command}"`,
                );
            }

            this.logger.logInfo(`Executing async command: ${command}`);
            const { stdout, stderr } = await execAsync(command, { cwd });
            if (stderr) {
                this.logger.logMessageByStatus(MessageStatus.ERROR, `command error: ${stderr}`);
            }
            this.logger.logMessageByStatus(MessageStatus.FINISHED, stdout);
            return stdout.trim();
        } catch (error: any) {
            this.errorHandler.handleError(error);
            throw error;
        }
    }
}
