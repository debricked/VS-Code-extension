import {
    StatusBarMessageHelper,
    StatusMessage,
    Logger,
    Terminal,
    GitHelper,
    Common,
    GlobalState,
    DebrickedDataHelper,
    ShowInputBoxHelper,
    ErrorHandler,
} from "../helpers";
import { DebrickedCommands, MessageStatus, Organization } from "../constants/index";
import { DebrickedCommandNode, Flag, RepositoryInfo } from "../types";
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
            ScanService.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());
            const cmdParams = [];
            const command: DebrickedCommandNode = DebrickedCommands.SCAN;

            cmdParams.push(command.cli_command);
            const currentRepoData: RepositoryInfo = await ScanService.globalState.getGlobalDataByKey(
                Organization.repoDataKey,
                await GitHelper.getRepositoryName(),
            );
            Logger.logMessageByStatus(MessageStatus.INFO, `Current repository name: ${currentRepoData.repositoryName}`);

            if (currentRepoData?.repositoryName !== MessageStatus.UNKNOWN) {
                if (command.flags && command.flags.length > 0) {
                    await ScanService.handleFlags(command.flags[1], cmdParams, currentRepoData);
                    await ScanService.handleFlags(command.flags[3], cmdParams, currentRepoData);
                    await ScanService.handleFlags(command.flags[4], cmdParams, currentRepoData);
                }
            } else {
                Logger.logMessageByStatus(MessageStatus.WARN, `No default repo selected`);

                if (command.flags && command.flags.length > 0) {
                    await ScanService.handleFlags(command.flags[0], cmdParams, currentRepoData);
                    await ScanService.handleFlags(command.flags[3], cmdParams, currentRepoData);
                    await ScanService.handleFlags(command.flags[4], cmdParams, currentRepoData);
                    await ScanService.handleFlags(command.flags[5], cmdParams, currentRepoData);
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
            ErrorHandler.handleError(error);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.SCAN.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.INFO, "Scan service finished.");
        }
    }

    static async handleFlags(selectedFlags: Flag, cmdParams: string[], currentRepoData: RepositoryInfo) {
        Logger.logMessageByStatus(MessageStatus.INFO, `Handling flag: ${selectedFlags.flag}(${selectedFlags.label})`);
        cmdParams.push(selectedFlags.flag);
        switch (selectedFlags.flag) {
            case "-r":
                const providedRepo = await ShowInputBoxHelper.promptForInput({
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
                const username = currentRepoData.userName;
                const email = currentRepoData.email;
                cmdParams.push(`"${username} (${email})"`);
                Logger.logMessageByStatus(MessageStatus.INFO, `User info added: ${username} (${email})`);
                break;

            case "-b":
                if (selectedFlags.flagValue) {
                    cmdParams.push(Common.replacePlaceholder(selectedFlags.flagValue, currentRepoData.currentBranch));
                    Logger.logInfo(`Branch info added: ${currentRepoData.currentBranch}`);
                }
                break;

            case "-c":
                if (selectedFlags.flagValue) {
                    const commitHash = currentRepoData.commitID;
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
            ScanService.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());

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
            ErrorHandler.handleError(error);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.SCAN.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.INFO, "Watchers for Manifest files are now ready to scan.");
        }
    }
}
