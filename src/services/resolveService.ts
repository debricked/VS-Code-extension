import { Logger, errorHandler, globalStore, commonHelper, terminal } from "../helpers";
import { DebrickedCommands, MessageStatus, Organization } from "../constants/index";
import { DebrickedCommandNode } from "../types";

export class ResolveService {
    static async resolveService() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register resolveCommand");

            globalStore.setSequenceID(commonHelper.generateHashCode());
            const cmdParams: string[] = [];
            const command: DebrickedCommandNode = DebrickedCommands.RESOLVE;

            cmdParams.push(command.cli_command);
            cmdParams.push(Organization.workspace);

            Logger.logMessageByStatus(MessageStatus.INFO, `Executing terminal command with parameters: ${cmdParams}`);
            await terminal.createAndUseTerminal(DebrickedCommands.BASE_COMMAND.description, cmdParams, true);
        } catch (error: any) {
            errorHandler.handleError(error);
        } finally {
            Logger.logMessageByStatus(MessageStatus.INFO, "Scan service finished.");
        }
    }
}
