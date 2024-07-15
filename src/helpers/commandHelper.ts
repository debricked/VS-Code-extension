import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";
import { AuthHelper, Logger } from "../helpers";
import { execFile } from "child_process";

export class Command {
    public static async executeCommand(
        cmdParams: string[] = [],
        accessTokenRequired: boolean = false,
    ): Promise<string> {
        if (accessTokenRequired) {
            const flags = DebrickedCommands.getCommandSpecificFlags("Debricked") || [];
            const accessToken = await AuthHelper.getAccessToken();

            if (accessToken) {
                cmdParams.push(flags[0].flag);
                cmdParams.push(accessToken);
                Logger.logMessage(`${Messages.CMD_EXEC_WITH_ACCESS_TOKEN}: ${cmdParams.join(" ")}`);
            }
        } else {
            Logger.logMessage(`${Messages.CMD_EXEC_WITHOUT_ACCESS_TOKEN}: ${cmdParams.join(" ")}`);
        }

        return new Promise((resolve, reject) => {
            execFile(
                Organization.debricked_cli,
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
}
