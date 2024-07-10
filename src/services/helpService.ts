import { Organization, MessageStatus, DebrickedCommands, Messages } from "../constants/index";
import { StatusBarMessageHelper, Terminal, QuickPick, StatusMessage, AuthHelper, Logger } from "../helpers";

export class HelpService {
    static async help(goCliPath: string, seqToken: string) {
        try {
            const cmdParams = [];
            const subCommand: any = DebrickedCommands.BASE_COMMAND;

            let selectedFlags: any;
            if (subCommand.command) {
                selectedFlags = await QuickPick.showQuickPick(subCommand.flags, Messages.QUICK_PICK_FLAG);
            }

            if (selectedFlags && selectedFlags.flag) {
                cmdParams.push(selectedFlags.flag);
            }

            let flags = DebrickedCommands.getCommandSpecificFlags("Debricked") || [];
            let accessToken: string | undefined;
            if (selectedFlags && selectedFlags.flag === flags[0].flag) {
                accessToken = await AuthHelper.getAccessToken();
                if (accessToken) {
                    cmdParams.push(accessToken);
                }
            }

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.HELP.cli_command),
            );
            Terminal.createAndUseTerminal(
                DebrickedCommands.BASE_COMMAND.description,
                `${goCliPath} ${cmdParams.join(" ")}`,
                seqToken,
            );
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
            Logger.logMessageByStatus(MessageStatus.ERROR, error, seqToken);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.HELP.cli_command),
            );
        }
    }
}
