import { Organization, MessageStatus, DebrickedCommands, Messages } from "../constants/index";
import { StatusBarMessageHelper, Terminal, QuickPick, StatusMessage, Logger, Common, GlobalStore } from "../helpers";

export class HelpService {
    private static globalStore = GlobalStore.getInstance();

    static async help() {
        try {
            HelpService.globalStore.setSeqToken(Common.generateHashCode());
            const cmdParams = [];
            const subCommand: any = DebrickedCommands.BASE_COMMAND;

            let selectedFlags: any;
            if (subCommand.command) {
                selectedFlags = await QuickPick.showQuickPick(subCommand.flags, Messages.QUICK_PICK_FLAG);
            }

            let accessTokenRequired: boolean = false;
            if (selectedFlags && selectedFlags.flag) {
                accessTokenRequired = selectedFlags.flag === "-t" ? true : false;
                if (!accessTokenRequired) {
                    cmdParams.push(selectedFlags.flag);
                }
            }

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.HELP.cli_command),
            );
            Terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description, cmdParams, accessTokenRequired);
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
            Logger.logMessageByStatus(MessageStatus.ERROR, error.stack);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.HELP.cli_command),
            );
        }
    }
}
