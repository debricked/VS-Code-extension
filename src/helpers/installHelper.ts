import * as path from "path";
import * as os from "os";
import { Messages, MessageStatus, Organization } from "../constants/index";
import * as vscode from "vscode";
import { StatusBarMessageHelper } from "./statusBarMessageHelper";
import { Logger } from "./loggerHelper";
import { Command } from "./commandHelper";

export class InstallHelper {
    private platform: string;
    private scriptDir: string;

    constructor(
        private logger: typeof Logger,
        private statusBarMessageHelper: StatusBarMessageHelper,
        private commandHelper: Command,
    ) {
        this.platform = os.platform();
        this.scriptDir = path.join(__dirname, "..", Organization.debrickedInstaller);
    }

    private getScriptPath(): { install: string; command: string } {
        this.logger.logInfo(`Debricked running on: ${this.platform}`);
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
                    const installOutput = await this.commandHelper.execute(installCommand);
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
