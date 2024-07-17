import { QuickPick, StatusBarMessageHelper, StatusMessage, Logger, Terminal, GitHelper } from "../helpers";
import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";
import { Flag } from "../types";
import * as vscode from "vscode";
import { Common, setSeqToken } from "../helpers";

export class ScanService {
    static async scanService() {
        try {
            setSeqToken(Common.generateHashCode());
            const cmdParams = [];
            const command: any = DebrickedCommands.SCAN;

            cmdParams.push(command.cli_command);
            const currentRepoName = await GitHelper.getUpstream();
            if (currentRepoName.indexOf(".git") > -1) {
                Logger.logMessageByStatus(
                    MessageStatus.WARN,
                    `scan performed on: ${await GitHelper.getRepositoryName()}`,
                );
            } else {
                Logger.logMessageByStatus(MessageStatus.WARN, `No default repo selected`);
                cmdParams.push("-r");
                const providedRepo = await vscode.window.showInputBox({
                    title: "Enter Repository name",
                    prompt: "enter repository name",
                    ignoreFocusOut: false,
                });

                if (providedRepo) {
                    cmdParams.push(providedRepo);
                    Logger.logMessageByStatus(MessageStatus.INFO, `selected repo: ${providedRepo}`);
                }
                Logger.logMessageByStatus(MessageStatus.INFO, `selected repo: ${providedRepo}`);
            }

            let selectedFlags: Flag | undefined;
            if (command.flags && command.flags.length > 0) {
                selectedFlags = await QuickPick.showQuickPick(command.flags, Messages.QUICK_PICK_FLAG);
            }

            if (selectedFlags && selectedFlags.flag) {
                cmdParams.push(selectedFlags.flag);

                if (selectedFlags.flag === "-r") {
                    const providedRepo = await vscode.window.showInputBox({
                        title: "Enter Repository name",
                        prompt: "enter repository name",
                        ignoreFocusOut: false,
                    });

                    if (providedRepo) {
                        cmdParams.push(providedRepo);
                        Logger.logMessageByStatus(MessageStatus.INFO, `selected repo: ${providedRepo}`);
                    }
                } else if (selectedFlags.flag === "-i" && selectedFlags.flagValue) {
                    cmdParams.push(selectedFlags.flagValue);
                } else if (selectedFlags.flag === "-j" && selectedFlags.report) {
                    cmdParams.push(selectedFlags.report);
                } else if (selectedFlags.flag === "-a") {
                    cmdParams.push(`"${await GitHelper.getUsername()} (${await GitHelper.getEmail()})"`);
                } else if (selectedFlags.flag === "-b" && selectedFlags.flagValue) {
                    cmdParams.push(
                        Common.replacePlaceholder(selectedFlags.flagValue, await GitHelper.getCurrentBranch()),
                    );
                } else if (selectedFlags.flag === "-c" && selectedFlags.flagValue) {
                    cmdParams.push(Common.replacePlaceholder(selectedFlags.flagValue, await GitHelper.getCommitHash()));
                }
            }

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.SCAN.cli_command),
            );

            Terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description, cmdParams, true);

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.COMPLETE, DebrickedCommands.SCAN.cli_command),
            );
        } catch (error: any) {
            StatusBarMessageHelper.showErrorMessage(
                `${Organization.name} - ${DebrickedCommands.SCAN.cli_command} ${MessageStatus.ERROR}: ${error.message}`,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.SCAN.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.ERROR, error.stack);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.SCAN.cli_command),
            );
        }
    }

    static async runDebrickedScan(e: vscode.Uri) {
        if (e.path.endsWith("package.json")) {
            setSeqToken(Common.generateHashCode());
            await ScanService.scanService();
        }
    }
}
