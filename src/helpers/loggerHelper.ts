import * as fs from "fs";
import * as path from "path";
import { Organization } from "../constants/index";
import { Common } from "../helpers";
import { getSeqToken } from "../helpers";

export class Logger {
    private static logDirPath = path.join(Organization.workspace, Organization.report);
    private static logFilePath = path.join(Logger.logDirPath, Organization.log_file);

    public static async logMessage(message: string) {
        if (!fs.existsSync(Logger.logDirPath)) {
            fs.mkdirSync(Logger.logDirPath, { recursive: true });
        }

        const timestamp = new Date().toISOString();
        const userId = await Common.getFromDebrickedData("user_id");
        const sequenceId = getSeqToken() ? `[seq_id:${getSeqToken()}]` : "";

        const logEntry = `[${timestamp}] [user_id:${userId}] ${sequenceId} ${message}\n`;
        fs.appendFileSync(Logger.logFilePath, logEntry, "utf-8");
    }

    public static logMessageByStatus(status: string, message: string) {
        Logger.logMessage(`[${status}] ${message}`);
    }
}
