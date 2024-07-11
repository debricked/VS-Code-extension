import { DebrickedCommands, MessageStatus, Organization } from "../constants/index";
import { AuthHelper, Logger } from "../helpers";
import { execFile } from "child_process";

export class Command {
    public static async executeCommand(
        seqToken: string,
        cmdParams: string[] = [],
        accessTokenRequired: boolean = false,
    ): Promise<string> {
        if (accessTokenRequired) {
            const flags = DebrickedCommands.getCommandSpecificFlags("Debricked") || [];
            const accessToken = await AuthHelper.getAccessToken();

            if (accessToken) {
                cmdParams.push(flags[0].flag);
                cmdParams.push(accessToken);
                Logger.logMessage(`Executing command with access_token`, seqToken);
            }
        }

        Logger.logMessage(`Command Execution started : ${cmdParams}`, seqToken);

        return new Promise((resolve, reject) => {
            execFile(
                Organization.debricked_cli,
                cmdParams,
                (error: any, stdout: string | PromiseLike<string>, stderr: string | undefined) => {
                    if (error) {
                        Logger.logMessageByStatus(MessageStatus.ERROR, error, seqToken);
                        reject(new Error(stderr));
                    } else {
                        Logger.logMessageByStatus(MessageStatus.FINISHED, error, seqToken);
                        resolve(stdout);
                    }
                },
            );
        });
    }
}
