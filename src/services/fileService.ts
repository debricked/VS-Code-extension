import {
    StatusBarMessageHelper,
    StatusMessage,
    Logger,
    Terminal,
    QuickPick,
    Command,
    GlobalStore,
    Common,
    GitHelper,
} from "../helpers";
import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";
import { DebrickedCommandNode } from "../types";

export class FileService {
    private static globalStore = GlobalStore.getInstance();
    static async filesService() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Starting File service...");
            FileService.globalStore.setSeqToken(Common.generateHashCode());

            const cmdParams = [];
            const command: DebrickedCommandNode = DebrickedCommands.FILES;

            cmdParams.push(command.cli_command);

            let selectedSubCommand: DebrickedCommandNode | undefined;

            if (command.sub_commands && command.sub_commands.length > 0) {
                selectedSubCommand = await QuickPick.showQuickPick(
                    command.sub_commands,
                    Messages.QUICK_PICK_SUB_COMMAND,
                );
                if (selectedSubCommand && selectedSubCommand.cli_command) {
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
            Logger.logMessageByStatus(MessageStatus.INFO, "Starting find files service...");
            FileService.globalStore.setSeqToken(Common.generateHashCode());
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

            Logger.logMessageByStatus(MessageStatus.INFO, `Executing terminal command with parameters: ${cmdParams}`);

            const foundFiles = await Command.executeAsyncCommand(
                `${Organization.debricked_cli} ${cmdParams.join(" ")}`,
                true,
            );
            const foundFilesArray = Common.stringToArray(foundFiles, "\n");
            await GitHelper.setupGit();

            let debrickedData: any = await Common.readDataFromDebrickedJSON();
            debrickedData = JSON.parse(debrickedData);
            const repositoryName = await GitHelper.getRepositoryName();

            let selectedRepoName: string;
            if (repositoryName) {
                selectedRepoName = repositoryName;
            } else {
                selectedRepoName = "unknown";
                if (!debrickedData[selectedRepoName]) {
                    debrickedData[selectedRepoName] = {};
                }
            }

            debrickedData[selectedRepoName].filesToScan = foundFilesArray;

            await Common.writeDataToDebrickedJSON(debrickedData);

            Logger.logMessageByStatus(MessageStatus.INFO, `Found Files: ${foundFilesArray}`);
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
        const debrickedData: any = await FileService.globalStore.getDebrickedData();
        const repositoryName = await GitHelper.getRepositoryName();
        if (repositoryName) {
            return debrickedData[repositoryName].filesToScan;
        } else {
            return debrickedData["unknown"].filesToScan;
        }
    }
}
