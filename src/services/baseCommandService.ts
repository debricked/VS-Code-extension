import { DebrickedCommands, MessageStatus, Organization } from "../constants/index";
import { StatusBarMessageHelper, Terminal, StatusMessage, Logger } from "../helpers";

export class BaseCommandService {
    static async baseCommand() {
        try {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.HELP.cli_command),
            );
            Terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description);
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.COMPLETE, DebrickedCommands.HELP.cli_command),
            );
        } catch (error: any) {
            StatusBarMessageHelper.showErrorMessage(
                `${Organization.name} - ${DebrickedCommands.HELP.cli_command} ${MessageStatus.ERROR}: ${error.message}`,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.HELP.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.ERROR, error);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.HELP.cli_command),
            );
        }
    }
}
