import { ORGANIZATION } from "../constants";
import { MESSAGE_STATUS } from "../constants/messages";
import { DEBRICKED_CLI_COMMANDS } from "../constants/debricked_cli";
import {
    StatusBarMessageHelper,
    Terminal,
    QuickPick,
    StatusMessage,
    AuthHelper,
    Logger,
} from "@helpers";

export default class HelpService {
    static async help(goCliPath: string, seqToken: string) {
        try {
            const cmdParams = [];
            const subCommand: any = DEBRICKED_CLI_COMMANDS.BASE_COMMAND;

            let selectedFlags: any;
            if (subCommand.command) {
                selectedFlags = await QuickPick.showQuickPick(
                    subCommand.flags,
                    "Select a flag to use (optional)",
                );
            }

            if (selectedFlags && selectedFlags.flag) {
                cmdParams.push(selectedFlags.flag);
            }

            let accessToken: string | undefined;
            if (
                selectedFlags &&
                selectedFlags.flag ===
                    DEBRICKED_CLI_COMMANDS.BASE_COMMAND.flags[0].flag
            ) {
                accessToken = await AuthHelper.getAccessToken();
                if (accessToken) {
                    cmdParams.push(accessToken);
                }
            }

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(
                    MESSAGE_STATUS.START,
                    DEBRICKED_CLI_COMMANDS.HELP.cli_command,
                ),
            );
            Terminal.createAndUseTerminal(
                DEBRICKED_CLI_COMMANDS.BASE_COMMAND.description,
                `${goCliPath} ${cmdParams.join(" ")}`,
                seqToken,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(
                    MESSAGE_STATUS.COMPLETE,
                    DEBRICKED_CLI_COMMANDS.HELP.cli_command,
                ),
            );
        } catch (error: any) {
            StatusBarMessageHelper.showErrorMessage(
                `${ORGANIZATION.name} - ${DEBRICKED_CLI_COMMANDS.HELP.cli_command} ${MESSAGE_STATUS.ERROR}: ${error.message}`,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(
                    MESSAGE_STATUS.ERROR,
                    DEBRICKED_CLI_COMMANDS.HELP.cli_command,
                ),
            );
            Logger.logMessageByStatus(MESSAGE_STATUS.ERROR, error, seqToken);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(
                    MESSAGE_STATUS.FINISHED,
                    DEBRICKED_CLI_COMMANDS.HELP.cli_command,
                ),
            );
        }
    }
}
