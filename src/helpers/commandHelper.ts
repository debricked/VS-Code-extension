import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";
import { AuthHelper, ErrorHandler, Logger } from "../helpers";
import { execFile, exec } from "child_process";
import * as vscode from "vscode";
import { promisify } from "util";
export class Command {
    public static async executeCommand(
        cmdParams: string[] = [],
        accessTokenRequired: boolean = false,
    ): Promise<string> {
        if (accessTokenRequired) {
            const flags = DebrickedCommands.getCommandSpecificFlags("Debricked") || [];
            const accessToken = await AuthHelper.getToken(true, Organization.access);

            if (accessToken) {
                cmdParams.push(flags[0].flag);
                cmdParams.push(accessToken);
                Logger.logMessageByStatus(
                    MessageStatus.INFO,
                    `${Messages.CMD_EXEC_WITH_ACCESS_TOKEN}: ${cmdParams.join(" ")}`,
                );
            }
        } else {
            Logger.logMessageByStatus(
                MessageStatus.INFO,
                `${Messages.CMD_EXEC_WITHOUT_ACCESS_TOKEN}: ${cmdParams.join(" ")}`,
            );
        }

        return new Promise((resolve, reject) => {
            execFile(
                Organization.debrickedCli,
                cmdParams,
                (error: any, stdout: string | PromiseLike<string>, stderr: string | undefined) => {
                    if (error) {
                        Logger.logMessageByStatus(MessageStatus.ERROR, error);
                        reject(new Error(stderr));
                    } else {
                        Logger.logMessageByStatus(MessageStatus.FINISHED, error);
                        resolve(stdout);
                    }
                },
            );
        });
    }

    public static async executeAsyncCommand(command: string, accessTokenRequired: boolean = false): Promise<string> {
        try {
            const execAsync = promisify(exec);

            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                Logger.logMessageByStatus(MessageStatus.ERROR, "No workspace folder open");
                throw new Error("No workspace folder open");
            }
            const cwd = workspaceFolders[0].uri.fsPath;

            if (accessTokenRequired) {
                const flags = DebrickedCommands.getCommandSpecificFlags("Debricked") || [];
                const accessToken = await AuthHelper.getToken(true, Organization.access);

                if (accessToken) {
                    command = `${command} ${flags[0].flag} ${accessToken}`;
                    Logger.logMessageByStatus(
                        MessageStatus.INFO,
                        `${Messages.CMD_EXEC_WITH_ACCESS_TOKEN}: "${command} "`,
                    );
                }
            } else {
                Logger.logMessageByStatus(
                    MessageStatus.INFO,
                    `${Messages.CMD_EXEC_WITHOUT_ACCESS_TOKEN}: "${command}"`,
                );
            }

            const { stdout, stderr } = await execAsync(command, { cwd });
            if (stderr) {
                Logger.logMessageByStatus(MessageStatus.ERROR, `command error: ${stderr}`);
            }
            return stdout.trim();
        } catch (error: any) {
            ErrorHandler.handleError(error);
            return "";
        }
    }
}
