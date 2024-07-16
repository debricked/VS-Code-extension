import * as path from "path";
import * as os from "os";
import { exec } from "child_process";
import { Messages, MessageStatus, Organization } from "../constants/index";
import { Logger } from "../helpers";

export class InstallHelper {
    private platform: string;
    private scriptDir: string;

    constructor() {
        this.platform = os.platform();
        Logger.logMessageByStatus(MessageStatus.INFO, `Debricked running on: ${this.platform}`);
        this.scriptDir = path.join(__dirname, "..", Organization.debricked_installer);
    }

    private getScriptPath(): { install: string; command: string } {
        switch (this.platform) {
            case Organization.os_win32:
                return {
                    install: path.join(this.scriptDir, Organization.install_bat),
                    command: "", // No command prefix needed for .bat files
                };
            case Organization.os_linux:
            case Organization.os_darwin:
                return {
                    install: path.join(this.scriptDir, Organization.install_sh),
                    command: Organization.bash,
                };
            default:
                Logger.logMessageByStatus(MessageStatus.ERROR, `${Messages.UNSUPPORTED_OS}: ${this.platform}`);
                throw new Error(Messages.UNSUPPORTED_OS);
        }
    }

    private executeCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Execution error: ${stderr}`));
                } else {
                    resolve(stdout.trim());
                }
            });
        });
    }

    public async runInstallScript() {
        try {
            const { install, command } = this.getScriptPath();

            Logger.logMessageByStatus(MessageStatus.INFO, `Starting installation...`);
            const installCommand = this.platform === Organization.os_win32 ? `"${install}"` : `${command} "${install}"`;
            const installOutput = await this.executeCommand(installCommand);
            Logger.logMessageByStatus(MessageStatus.INFO, `${installOutput}`);
            Logger.logMessageByStatus(MessageStatus.INFO, `${Messages.INSTALLATION_SUCCESS}`);
        } catch (error) {
            Logger.logMessageByStatus(MessageStatus.ERROR, `${Messages.INSTALLATION_ERROR}: ${error}`);
            process.exit(1);
        }
    }
}
