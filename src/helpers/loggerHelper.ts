import * as fs from "fs";
import * as path from "path";
import { Organization } from "../constants/index";
import { Common } from "../helpers";
import { getSeqToken } from "../helpers";

export class Logger {
    private static logFilePath = path.join(
        Organization.debricked_installed_dir,
        Organization.debrickedFolder,
        Organization.log_file,
    );

    public static async logMessage(message: string) {
        if (!fs.existsSync(Organization.debricked_installed_dir)) {
            fs.mkdirSync(Organization.debricked_installed_dir, { recursive: true });
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
