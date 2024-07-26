import {
    StatusBarMessageHelper,
    StatusMessage,
    Logger,
    Terminal,
    GitHelper,
    Common,
    GlobalState,
    DebrickedDataHelper,
} from "../helpers";
import { DebrickedCommands, MessageStatus, Organization } from "../constants/index";
import { DebrickedCommandNode, Flag } from "../types";
import * as vscode from "vscode";
import path from "path";

export class ScanService {
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }
    static async scanService() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register ScanCommand");

            DebrickedDataHelper.createDir(Organization.reportsFolderPath);
            ScanService.globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());
            const cmdParams = [];
            const command: DebrickedCommandNode = DebrickedCommands.SCAN;

            cmdParams.push(command.cli_command);
            const currentRepoName = await GitHelper.getUpstream();
            Logger.logMessageByStatus(MessageStatus.INFO, `Current repository name: ${currentRepoName}`);

            if (currentRepoName.indexOf(".git") > -1) {
                Logger.logMessageByStatus(
                    MessageStatus.INFO,
                    `Scan performed on: ${await GitHelper.getRepositoryName()}`,
                );

                if (command.flags && command.flags.length > 0) {
                    await ScanService.handleFlags(command.flags[1], cmdParams);
                    await ScanService.handleFlags(command.flags[3], cmdParams);
                    await ScanService.handleFlags(command.flags[4], cmdParams);
                }
            } else {
                Logger.logMessageByStatus(MessageStatus.WARN, `No default repo selected`);

                if (command.flags && command.flags.length > 0) {
                    await ScanService.handleFlags(command.flags[0], cmdParams);
                    await ScanService.handleFlags(command.flags[3], cmdParams);
                    await ScanService.handleFlags(command.flags[4], cmdParams);
                    await ScanService.handleFlags(command.flags[5], cmdParams);
                }
            }

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.SCAN.cli_command),
            );

            Logger.logMessageByStatus(MessageStatus.INFO, `Executing terminal command with parameters: ${cmdParams}`);
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
            Logger.logMessageByStatus(MessageStatus.ERROR, `Error during scan service: ${error.stack}`);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.SCAN.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.INFO, "Scan service finished.");
        }
    }

    static async handleFlags(selectedFlags: Flag, cmdParams: string[]) {
        Logger.logMessageByStatus(MessageStatus.INFO, `Handling flag: ${selectedFlags.flag}(${selectedFlags.label})`);
        cmdParams.push(selectedFlags.flag);
        switch (selectedFlags.flag) {
            case "-r":
                const providedRepo = await vscode.window.showInputBox({
                    title: "Enter Repository name",
                    prompt: "Enter repository name",
                    ignoreFocusOut: false,
                });

                if (providedRepo) {
                    cmdParams.push(providedRepo);
                    Logger.logMessageByStatus(MessageStatus.INFO, `Selected repo: ${providedRepo}`);
                }
                break;

            case "-i":
                if (selectedFlags.flagValue) {
                    cmdParams.push(selectedFlags.flagValue);
                    Logger.logMessageByStatus(MessageStatus.INFO, `Flag value added: ${selectedFlags.flagValue}`);
                }
                break;

            case "-j":
                if (selectedFlags.report) {
                    cmdParams.push(selectedFlags.report);
                    Logger.logMessageByStatus(MessageStatus.INFO, `Report added: ${selectedFlags.report}`);
                }
                break;

            case "-a":
                const username = await GitHelper.getUsername();
                const email = await GitHelper.getEmail();
                cmdParams.push(`"${username} (${email})"`);
                Logger.logMessageByStatus(MessageStatus.INFO, `User info added: ${username} (${email})`);
                break;

            case "-b":
                if (selectedFlags.flagValue) {
                    const currentBranch = await GitHelper.getCurrentBranch();
                    cmdParams.push(Common.replacePlaceholder(selectedFlags.flagValue, currentBranch));
                    Logger.logMessageByStatus(MessageStatus.INFO, `Branch info added: ${currentBranch}`);
                }
                break;

            case "-c":
                if (selectedFlags.flagValue) {
                    const commitHash = await GitHelper.getCommitHash();
                    cmdParams.push(Common.replacePlaceholder(selectedFlags.flagValue, commitHash));
                    Logger.logMessageByStatus(MessageStatus.INFO, `Commit hash added: ${commitHash}`);
                }
                break;

            default:
                Logger.logMessageByStatus(MessageStatus.WARN, `Unrecognized flag: ${selectedFlags.flag}`);
                break;
        }
    }

    static async addWatcherToManifestFiles(filesToScan: string[], context: vscode.ExtensionContext) {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Add Watchers To Manifest Files");
            ScanService.globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());

            if (filesToScan && filesToScan.length > 0) {
                const filesPattern = new RegExp(filesToScan.map((file: any) => `^${file}$`).join("|"));

                vscode.window.onDidChangeActiveTextEditor((editor) => {
                    if (editor && filesPattern.test(path.basename(editor.document.fileName))) {
                        vscode.commands.executeCommand("setContext", "debrickedFilesToScan", true);
                    } else {
                        vscode.commands.executeCommand("setContext", "debrickedFilesToScan", false);
                    }
                });

                filesToScan.forEach((file: any) => {
                    const watcher = vscode.workspace.createFileSystemWatcher(`**/${file}`);

                    const runScan = async () => {
                        await this.scanService();
                    };

                    watcher.onDidChange(runScan);
                    watcher.onDidCreate(runScan);
                    watcher.onDidDelete(runScan);
                    Logger.logMessageByStatus(MessageStatus.INFO, `register watcher on ${file}`);
                    context.subscriptions.push(watcher);
                });
                Logger.logInfo("watchers added successfully");
            } else {
                Logger.logInfo("No manifest files found");
            }

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.SCAN.cli_command),
            );

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
            Logger.logMessageByStatus(MessageStatus.ERROR, `Error during adding watchers: ${error.stack}`);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.SCAN.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.INFO, "Scan service finished.");
        }
    }
}
