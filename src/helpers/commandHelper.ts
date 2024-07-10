import { Logger } from "../helpers";
import { execFile } from "child_process";

export class Command {
    public static async executeCommand(cliPath: string, cliCommand: any[], seqToken: string): Promise<string> {
        Logger.logMessage(`Executing command: ${cliPath} ${cliCommand.join(" ")}`, seqToken);

        return new Promise((resolve, reject) => {
            execFile(
                cliPath,
                cliCommand,
                (error: any, stdout: string | PromiseLike<string>, stderr: string | undefined) => {
                    if (error) {
                        reject(new Error(stderr));
                    } else {
                        resolve(stdout);
                    }
                },
            );
        });
    }
}
