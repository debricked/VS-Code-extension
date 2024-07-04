import { ORGANIZATION } from "@constants";
import { DEBRICKED_CLI_COMMANDS } from "src/constants/debricked_cli";
import { MESSAGE_STATUS } from "src/constants/messages";
import { logMessageByStatus } from "src/helpers/loggerHelper";
import { getStatusMessage } from "src/helpers/messageHelper";
import {
    setStatusBarMessage,
    showErrorMessage,
} from "src/helpers/statusBarMessageHelper";
import { createAndUseTerminal } from "src/helpers/terminalHelper";

export default class BaseCommandService {
    static async baseCommand(goCliPath: string, seqToken: string) {
        try {
            setStatusBarMessage(
                getStatusMessage(
                    MESSAGE_STATUS.START,
                    DEBRICKED_CLI_COMMANDS.HELP.cli_command,
                ),
            );
            createAndUseTerminal(
                DEBRICKED_CLI_COMMANDS.BASE_COMMAND.description,
                `${goCliPath}`,
                seqToken,
            );
            setStatusBarMessage(
                getStatusMessage(
                    MESSAGE_STATUS.COMPLETE,
                    DEBRICKED_CLI_COMMANDS.HELP.cli_command,
                ),
            );
        } catch (error: any) {
            showErrorMessage(
                `${ORGANIZATION.name} - ${DEBRICKED_CLI_COMMANDS.HELP.cli_command} ${MESSAGE_STATUS.ERROR}: ${error.message}`,
            );
            setStatusBarMessage(
                getStatusMessage(
                    MESSAGE_STATUS.ERROR,
                    DEBRICKED_CLI_COMMANDS.HELP.cli_command,
                ),
            );
            logMessageByStatus(MESSAGE_STATUS.ERROR, error, seqToken);
        } finally {
            setStatusBarMessage(
                getStatusMessage(
                    MESSAGE_STATUS.FINISHED,
                    DEBRICKED_CLI_COMMANDS.HELP.cli_command,
                ),
            );
        }
    }
}
