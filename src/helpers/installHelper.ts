import * as path from "path";
import * as os from "os";
import { exec } from "child_process";
import { Messages, MessageStatus, Organization } from "../constants/index";
import * as vscode from "vscode";
import { StatusBarMessageHelper } from "./statusBarMessageHelper";
import { Logger } from "./loggerHelper";

export class InstallHelper {
    private platform: string;
    private scriptDir: string;

    constructor(
        private logger: typeof Logger,
        private statusBarMessageHelper: StatusBarMessageHelper,
    ) {
        this.platform = os.platform();
        this.logger.logMessageByStatus(MessageStatus.INFO, `Debricked running on: ${this.platform}`);
        this.scriptDir = path.join(__dirname, "..", Organization.debrickedInstaller);
    }

    private getScriptPath(): { install: string; command: string } {
        switch (this.platform) {
            case Organization.osWin32:
                return {
                    install: path.join(this.scriptDir, Organization.installBat),
                    command: "", // No command prefix needed for .bat files
                };
            case Organization.osLinux:
            case Organization.osDarwin:
                return {
                    install: path.join(this.scriptDir, Organization.installSh),
                    command: Organization.bash,
                };
            default:
                this.logger.logMessageByStatus(MessageStatus.ERROR, `${Messages.UNSUPPORTED_OS}: ${this.platform}`);
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
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: Organization.nameCaps,
                cancellable: false,
            },
            async (progress) => {
                try {
                    const { install, command } = this.getScriptPath();
                    progress.report({
                        message: "Installing the Debricked CLI",
                    });
                    this.logger.logMessageByStatus(MessageStatus.INFO, `Starting installation...`);
                    const installCommand =
                        this.platform === Organization.osWin32 ? `"${install}"` : `${command} "${install}"`;
                    const installOutput = await this.executeCommand(installCommand);
                    this.logger.logMessageByStatus(MessageStatus.INFO, `${installOutput}`);
                    this.logger.logMessageByStatus(MessageStatus.INFO, `${Messages.INSTALLATION_SUCCESS}`);
                    this.statusBarMessageHelper.showInformationMessage("CLI installed successfully");
                } catch (error: any) {
                    throw error;
                }
            },
        );
    }
}
