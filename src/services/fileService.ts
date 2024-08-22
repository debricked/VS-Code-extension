import {
    statusBarMessageHelper,
    Logger,
    showQuickPickHelper,
    commandHelper,
    errorHandler,
    globalStore,
    commonHelper,
} from "../helpers";
import { DebrickedCommands, Messages, MessageStatus, Organization, Regex } from "../constants/index";
import { DebrickedCommandNode, ScannedData } from "../types";
import * as vscode from "vscode";
import * as fs from "fs";

export class FileService {
    static async filesService() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register FileCommand");
            globalStore.setSequenceID(commonHelper.generateHashCode());

            const command = DebrickedCommands.FILES;

            if (!command.sub_commands || command.sub_commands.length === 0) {
                statusBarMessageHelper.showInformationMessage("No sub-commands available for Files service");
                return;
            }
            const selectedSubCommand = await showQuickPickHelper.showQuickPick(
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
            errorHandler.handleError(error);
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
                    globalStore.setSequenceID(commonHelper.generateHashCode());
                    const cmdParams = [];
                    const command: DebrickedCommandNode = DebrickedCommands.FILES;

                    cmdParams.push(command.cli_command);

                    let selectedSubCommand: DebrickedCommandNode | undefined;
                    if (command.sub_commands && command.sub_commands.length > 0) {
                        selectedSubCommand = command.sub_commands[0];
                        if (selectedSubCommand && selectedSubCommand.cli_command) {
                            cmdParams.push(selectedSubCommand.cli_command, "-j");
                        }
                    }

                    Logger.logMessageByStatus(
                        MessageStatus.INFO,
                        `Executing terminal command with parameters: ${cmdParams}`,
                    );

                    progress.report({ message: "🚀Finding Files..." });

                    const foundFiles = JSON.parse(
                        await commandHelper.executeAsyncCommand(`${Organization.debrickedCli} ${cmdParams.join(" ")}`),
                    );
                    const foundFilesArray: string[] = foundFiles
                        .map((item: any) => item.manifestFile)
                        .filter((file: any) => file !== "");

                    const selectedRepoName = globalStore.getRepository();
                    let repoData: any = await globalStore.getGlobalStateInstance()?.getGlobalData(selectedRepoName, {});

                    if (!repoData) {
                        repoData = {};
                    }

                    repoData.filesToScan = foundFilesArray;
                    progress.report({ message: `$(pass) Found Files` });
                    await globalStore.getGlobalStateInstance()?.setGlobalData(selectedRepoName, repoData);
                    Logger.logMessageByStatus(
                        MessageStatus.INFO,
                        `Found ${foundFilesArray.length} Files: ${foundFilesArray}`,
                    );
                    return foundFilesArray;
                } catch (error: any) {
                    errorHandler.handleError(error);
                    throw error;
                } finally {
                    Logger.logMessageByStatus(MessageStatus.INFO, "Files service finished.");
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            },
        );
    }

    static async getFilesToScan() {
        const debrickedData: any = await globalStore
            .getGlobalStateInstance()
            ?.getGlobalData(Organization.debrickedDataKey, {});
        const repositoryName = globalStore.getRepository();
        if (repositoryName) {
            return debrickedData[repositoryName]?.filesToScan;
        } else {
            return debrickedData["unknown"].filesToScan;
        }
    }

    static async setRepoScannedData() {
        const data: ScannedData = JSON.parse(
            fs.readFileSync(Organization.scannedOutputPath, {
                encoding: "utf8",
                flag: "r",
            }),
        );
        const url = data.detailsUrl;

        const repoId = Number(commonHelper.extractValueFromStringUsingRegex(url, Regex.repoId));
        const commitId = Number(commonHelper.extractValueFromStringUsingRegex(url, Regex.commitId));

        repoId ? globalStore.setRepoId(repoId) : null;
        commitId ? globalStore.setCommitId(commitId) : null;
        globalStore.setScanData(data);

        Logger.logInfo("Found the repoId and commitId");
    }
}
