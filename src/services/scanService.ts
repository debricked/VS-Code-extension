import {
    QuickPick,
    AuthHelper,
    StatusBarMessageHelper,
    StatusMessage,
    Command,
    FileHelper,
    Logger,
} from "../helpers";
import {
    DebrickedCommands,
    Messages,
    MessageStatus,
    Organization,
} from "../constants/index";
import { Flag } from "../types";

export class ScanService {
    static async scanService(goCliPath: string, seqToken: string) {
        try {
            const cmdParams = [];
            const subCommand: any = DebrickedCommands.SCAN;

            let selectedFlags: any;
            if (subCommand.command) {
                cmdParams.push(subCommand.cli_command);
                selectedFlags = await QuickPick.showQuickPick(
                    subCommand.flags,
                    Messages.QUICK_PICK_FLAG,
                );
            }

            if (selectedFlags && selectedFlags.flag) {
                cmdParams.push(selectedFlags.flag);
            }

            cmdParams.push(Organization.workspace);

            let global_flags: Flag[] | undefined =
                DebrickedCommands.SCAN.global_flags;
            let accessToken = await AuthHelper.getAccessToken();

            if (accessToken) {
                if (global_flags && global_flags.length > 0) {
                    cmdParams.push(global_flags[0].flag);
                }

                cmdParams.push(accessToken);
            }

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(
                    MessageStatus.START,
                    DebrickedCommands.SCAN.cli_command,
                ),
            );
            const result = await Command.executeCommand(
                goCliPath,
                cmdParams,
                seqToken,
            );
            await FileHelper.storeAndOpenFile(
                DebrickedCommands.SCAN.report
                    ? DebrickedCommands.SCAN.report
                    : "",
                result,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(
                    MessageStatus.COMPLETE,
                    DebrickedCommands.SCAN.cli_command,
                ),
            );
        } catch (error: any) {
            StatusBarMessageHelper.showErrorMessage(
                `${Organization.name} - ${DebrickedCommands.SCAN.cli_command} ${MessageStatus.ERROR}: ${error.message}`,
            );
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(
                    MessageStatus.ERROR,
                    DebrickedCommands.SCAN.cli_command,
                ),
            );
            Logger.logMessageByStatus(MessageStatus.ERROR, error, seqToken);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(
                    MessageStatus.FINISHED,
                    DebrickedCommands.SCAN.cli_command,
                ),
            );
        }
    }
}
