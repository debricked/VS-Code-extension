import * as path from "path";
import * as os from "os";
import { exec } from "child_process";
import { MessageStatus, Organization } from "../constants/index";
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
            case "win32":
                return {
                    install: path.join(this.scriptDir, "install-debricked.bat"),
                    command: "", // No command prefix needed for .bat files
                };
            case "linux":
            case "darwin":
                return {
                    install: path.join(this.scriptDir, "install-debricked.sh"),
                    command: "bash",
                };
            default:
                Logger.logMessageByStatus(MessageStatus.ERROR, `Unsupported operating system: ${this.platform}`);
                throw new Error("Unsupported operating system");
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
            const installCommand = this.platform === "win32" ? `"${install}"` : `${command} "${install}"`;
            const installOutput = await this.executeCommand(installCommand);
            Logger.logMessageByStatus(MessageStatus.INFO, `Install output: ${installOutput}`);
            Logger.logMessageByStatus(MessageStatus.INFO, "Installation script executed successfully");
        } catch (error) {
            Logger.logMessageByStatus(MessageStatus.ERROR, `Installation script execution failed: ${error}`);
            process.exit(1);
        }
    }
}
