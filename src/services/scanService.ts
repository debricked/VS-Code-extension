import { QuickPick, StatusBarMessageHelper, StatusMessage, Logger, Terminal } from "../helpers";
import { DebrickedCommands, Messages, MessageStatus, Organization } from "../constants/index";

export class ScanService {
    static async scanService() {
        try {
            const cmdParams = [];
            const subCommand: any = DebrickedCommands.SCAN;

            let selectedFlags: any;
            if (subCommand.command) {
                cmdParams.push(subCommand.cli_command);
                selectedFlags = await QuickPick.showQuickPick(subCommand.flags, Messages.QUICK_PICK_FLAG);
            }

            if (selectedFlags && selectedFlags.flag) {
                cmdParams.push(selectedFlags.flag);
            }

            cmdParams.push(Organization.workspace);

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.SCAN.cli_command),
            );

            // const result = await Command.executeCommand(seqToken, cmdParams, true);
            // await FileHelper.storeAndOpenFile(
            //     DebrickedCommands.SCAN.report ? DebrickedCommands.SCAN.report : "",
            //     result,
            // );

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
            Logger.logMessageByStatus(MessageStatus.ERROR, error);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.SCAN.cli_command),
            );
        }
    }
}
