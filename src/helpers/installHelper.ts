import * as path from "path";
import { Messages, MessageStatus, Organization } from "../constants/index";
import * as vscode from "vscode";
import { StatusBarMessageHelper } from "./statusBarMessageHelper";
import { Logger } from "./loggerHelper";
import { Command } from "./commandHelper";

export class InstallHelper {
    private scriptDir: string;

    constructor(
        private logger: typeof Logger,
        private statusBarMessageHelper: StatusBarMessageHelper,
        private commandHelper: Command,
        private osPlatform: string = Organization.osPlatform,
    ) {
        this.scriptDir = path.join(__dirname, "..", Organization.debrickedInstaller);
    }

    private getScriptPath(): { install: string; command: string } {
        this.logger.logInfo(`Debricked running on: ${this.osPlatform}`);
        switch (this.osPlatform) {
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
                this.logger.logMessageByStatus(MessageStatus.ERROR, `${Messages.UNSUPPORTED_OS}: ${this.osPlatform}`);
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
                        this.osPlatform === Organization.osWin32 ? `"${install}"` : `${command} "${install}"`;
                    const installOutput = await this.commandHelper.executeAsyncCommand(installCommand);
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
