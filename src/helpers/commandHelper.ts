import { execFile } from 'child_process';
import { logMessage } from './loggerHelper';

export async function executeCommand(cliPath: string, cliCommand: any[], seqToken: string): Promise<string> {
    logMessage(`Executing command: ${cliPath} ${cliCommand.join(' ')}`, seqToken);
    return new Promise((resolve, reject) => {
        execFile(cliPath, cliCommand, (error: any, stdout: string | PromiseLike<string>, stderr: string | undefined) => {
            if (error) {
                reject(new Error(stderr));
            } else {
                resolve(stdout);
            }
        });
    });
}
