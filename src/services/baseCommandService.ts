import { ORGANIZATION } from "@constants";
import { DEBRICKED_CLI_COMMANDS } from "src/constants/debricked_cli";
import { MESSAGE_STATUS } from "src/constants/messages";
import {
    StatusBarMessageHelper,
    Terminal,
    StatusMessage,
    Logger,
} from "@helpers";

export default class BaseCommandService {
    static async baseCommand(goCliPath: string, seqToken: string) {
        try {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(
                    MESSAGE_STATUS.START,
                    DEBRICKED_CLI_COMMANDS.HELP.cli_command,
                ),
            );
            Terminal.createAndUseTerminal(
                DEBRICKED_CLI_COMMANDS.BASE_COMMAND.description,
                `${goCliPath}`,
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
