import { QuickPick, StatusBarMessageHelper, StatusMessage, Logger, Terminal, Command, FileHelper } from "../helpers";
import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";
import { Flag } from "../types";

export class ScanService {
    static async scanService() {
        try {
            const cmdParams = [];
            const subCommand: any = DebrickedCommands.SCAN;

            let selectedFlags: Flag | undefined;
            if (subCommand.command) {
                cmdParams.push(subCommand.cli_command);
                selectedFlags = await QuickPick.showQuickPick(subCommand.flags, Messages.QUICK_PICK_FLAG);
            }

            cmdParams.push(Organization.workspace);

            if (selectedFlags && selectedFlags.flag) {
                cmdParams.push(selectedFlags.flag);
            }

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.SCAN.cli_command),
            );

            if (selectedFlags && selectedFlags.report) {
                cmdParams.push(selectedFlags.report);
                const result = await Command.executeCommand(cmdParams, true);
                await FileHelper.storeAndOpenFile(selectedFlags.report, result);
            } else {
                Terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description, cmdParams, true);
            }

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
            Logger.logMessageByStatus(MessageStatus.ERROR, error);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.SCAN.cli_command),
            );
        }
    }
}
