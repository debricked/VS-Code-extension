import {
    StatusBarMessageHelper,
    StatusMessage,
    Logger,
    Terminal,
    QuickPick,
    Command,
    Common,
    GitHelper,
    GlobalState,
} from "../helpers";
import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";
import { DebrickedCommandNode } from "../types";
import * as vscode from "vscode";

export class FileService {
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }
    static async filesService() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register FileCommand");
            FileService.globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());

            const cmdParams = [];
            const command: DebrickedCommandNode = DebrickedCommands.FILES;

            cmdParams.push(command.cli_command);

            let selectedSubCommand: DebrickedCommandNode | undefined;

            if (command.sub_commands && command.sub_commands.length > 0) {
                selectedSubCommand = await QuickPick.showQuickPick(
                    command.sub_commands,
                    Messages.QUICK_PICK_SUB_COMMAND,
                );
                if (selectedSubCommand?.cli_command) {
                    cmdParams.push(selectedSubCommand.cli_command);
                }
            }

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.FILES.cli_command),
            );

            Logger.logMessageByStatus(MessageStatus.INFO, `Executing terminal command with parameters: ${cmdParams}`);
            Terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description, cmdParams, true);

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.FILES.cli_command),
            );

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.COMPLETE, DebrickedCommands.FILES.cli_command),
            );
        } catch (error: any) {
            StatusBarMessageHelper.showErrorMessage(
                `${Organization.name} - ${DebrickedCommands.FILES.cli_command} ${MessageStatus.ERROR}: ${error.message}`,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.FILES.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.ERROR, `Error during Files service: ${error.stack}`);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.FILES.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.INFO, "Files service finished.");
        }
    }

    static async findFilesService() {
        try {
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: "Debricked",
                    cancellable: false,
                },
                async (progress) => {
                    progress.report({ increment: 0 });
                    progress.report({ message: "Finding manifest files...", increment: 25 });
                    Logger.logMessageByStatus(MessageStatus.INFO, "Register Find File Command");
                    FileService.globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());
                    const cmdParams = [];
                    const command: DebrickedCommandNode = DebrickedCommands.FILES;

                    cmdParams.push(command.cli_command);

                    let selectedSubCommand: DebrickedCommandNode | undefined;
                    if (command.sub_commands && command.sub_commands.length > 0) {
                        selectedSubCommand = command.sub_commands[0];
                        if (selectedSubCommand && selectedSubCommand.cli_command) {
                            cmdParams.push(selectedSubCommand.cli_command);
                        }
                    }

                    StatusBarMessageHelper.setStatusBarMessage(
                        StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.FILES.cli_command),
                    );

                    Logger.logMessageByStatus(
                        MessageStatus.INFO,
                        `Executing terminal command with parameters: ${cmdParams}`,
                    );

                    const foundFiles = await Command.executeAsyncCommand(
                        `${Organization.debricked_cli} ${cmdParams.join(" ")}`,
                    );
                    const foundFilesArray = Common.stringToArray(foundFiles, "\n");
                    progress.report({ message: "Fetching Git repository details...", increment: 25 });
                    await GitHelper.setupGit();
                    progress.report({ message: "Fetched Git repository details", increment: 25 });
                    const repoData: any = await FileService.globalState.getGlobalData(Organization.REPO_DATA_KEY, {});
                    const selectedRepoName = await GitHelper.getRepositoryName();

                    if (selectedRepoName && !repoData[selectedRepoName]) {
                        repoData[selectedRepoName] = {};
                    }

                    repoData[selectedRepoName].filesToScan = foundFilesArray;

                    await FileService.globalState.setGlobalData(Organization.REPO_DATA_KEY, repoData);
                    progress.report({ message: "Manifest Files have found", increment: 25 });
                    Logger.logMessageByStatus(MessageStatus.INFO, `Found Files: ${foundFilesArray}`);
                },
            );
        } catch (error: any) {
            StatusBarMessageHelper.showErrorMessage(
                `${Organization.name} - ${DebrickedCommands.FILES.cli_command} ${MessageStatus.ERROR}: ${error.message}`,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.FILES.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.ERROR, `Error during Files service: ${error.stack}`);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.FILES.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.INFO, "Files service finished.");
        }
    }

    static async getFilesToScan() {
        const debrickedData: any = await FileService.globalState.getGlobalData(Organization.DEBRICKED_DATA_KEY, {});
        const repositoryName = await GitHelper.getRepositoryName();
        if (repositoryName) {
            return debrickedData[repositoryName]?.filesToScan;
        } else {
            return debrickedData["unknown"].filesToScan;
        }
    }
}
