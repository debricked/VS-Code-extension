import { ORGANIZATION } from "../constants";
import { MESSAGE_STATUS } from "../constants/messages";
import { DEBRICKED_CLI_COMMANDS } from "../constants/debricked_cli";
import { AuthHelper } from "@helpers";
import { logMessageByStatus } from "../helpers/loggerHelper";
import { getStatusMessage } from "../helpers/messageHelper";
import { showQuickPick } from "../helpers/showQuickPickHelper";
import {
    setStatusBarMessage,
    showErrorMessage,
} from "../helpers/statusBarMessageHelper";
import { createAndUseTerminal } from "../helpers/terminalHelper";

export default class HelpService {
    static async help(goCliPath: string, seqToken: string) {
        try {
            const cmdParams = [];
            const subCommand: any = DEBRICKED_CLI_COMMANDS.BASE_COMMAND;

            let selectedFlags: any;
            if (subCommand.command) {
                selectedFlags = await showQuickPick(
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

            setStatusBarMessage(
                getStatusMessage(
                    MESSAGE_STATUS.START,
                    DEBRICKED_CLI_COMMANDS.HELP.cli_command,
                ),
            );
            createAndUseTerminal(
                DEBRICKED_CLI_COMMANDS.BASE_COMMAND.description,
                `${goCliPath} ${cmdParams.join(" ")}`,
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
