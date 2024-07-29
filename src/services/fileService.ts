import {
    StatusBarMessageHelper,
    Logger,
    QuickPick,
    Command,
    Common,
    GitHelper,
    GlobalState,
    ErrorHandler,
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
            FileService.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());

            const command = DebrickedCommands.FILES;

            if (!command.sub_commands || command.sub_commands.length === 0) {
                StatusBarMessageHelper.showInformationMessage("No sub-commands available for Files service");
                return;
            }
            const selectedSubCommand = await QuickPick.showQuickPick(
                command.sub_commands,
                Messages.QUICK_PICK_SUB_COMMAND,
            );

            if (!selectedSubCommand) {
                throw new Error("No option has been selected when running files command");
            }

            switch (selectedSubCommand.cli_command) {
                case "find":
                    await FileService.findFilesService();
                    break;
                default:
                    throw new Error(`Unsupported sub-command: ${selectedSubCommand.cli_command}`);
            }
        } catch (error: any) {
            ErrorHandler.handleError(error);
        }
    }

    static async findFilesService(): Promise<string[] | undefined> {
        return vscode.window.withProgress<string[] | undefined>(
            {
                location: vscode.ProgressLocation.Window,
                title: Organization.nameCaps,
                cancellable: false,
            },
            async (progress) => {
                try {
                    Logger.logMessageByStatus(MessageStatus.INFO, "Register Find File Command");
                    FileService.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());
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

                    Logger.logMessageByStatus(
                        MessageStatus.INFO,
                        `Executing terminal command with parameters: ${cmdParams}`,
                    );

                    progress.report({ message: "🚀Finding Files..." });

                    const foundFiles = await Command.executeAsyncCommand(
                        `${Organization.debrickedCli} ${cmdParams.join(" ")}`,
                    );
                    const foundFilesArray: string[] = Common.stringToArray(foundFiles, "\n");
                    await GitHelper.setupGit();
                    const selectedRepoName = await GitHelper.getRepositoryName();
                    const repoData: any = await FileService.globalState.getGlobalData(selectedRepoName, {});

                    if (selectedRepoName && !repoData[selectedRepoName]) {
                        repoData[selectedRepoName] = {};
                    }

                    repoData[selectedRepoName].filesToScan = foundFilesArray;
                    progress.report({ message: "🏁 Found Files" });
                    await FileService.globalState.setGlobalData(selectedRepoName, repoData);
                    Logger.logMessageByStatus(
                        MessageStatus.INFO,
                        `Found ${foundFilesArray.length} Files: ${foundFilesArray}`,
                    );
                    return foundFilesArray;
                } catch (error: any) {
                    ErrorHandler.handleError(error);
                    return undefined;
                } finally {
                    Logger.logMessageByStatus(MessageStatus.INFO, "Files service finished.");
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            },
        );
    }

    static async getFilesToScan() {
        const debrickedData: any = await FileService.globalState.getGlobalData(Organization.debrickedDataKey, {});
        const repositoryName = await GitHelper.getRepositoryName();
        if (repositoryName) {
            return debrickedData[repositoryName]?.filesToScan;
        } else {
            return debrickedData["unknown"].filesToScan;
        }
    }
}
