import * as fs from "fs";
import * as path from "path";
import { ORGANIZATION } from "../constants";
import Common from "./commonHelper";

export default class Logger {
    private static logDirPath = path.join(
        ORGANIZATION.workspace,
        ORGANIZATION.report,
    );
    private static logFilePath = path.join(
        Logger.logDirPath,
        ORGANIZATION.log_file,
    );

    public static async logMessage(message: string, seqToken?: string) {
        if (!fs.existsSync(Logger.logDirPath)) {
            fs.mkdirSync(Logger.logDirPath, { recursive: true });
        }

        const timestamp = new Date().toISOString();
        const userId = await Common.getFromDebrickedData("user_id");
        const sequenceId = seqToken ? `[seq_id:${seqToken}]` : "";

        const logEntry = `[${timestamp}] [user_id:${userId}] ${sequenceId} ${message}\n`;
        fs.appendFileSync(Logger.logFilePath, logEntry, "utf-8");
    }

    public static logMessageByStatus(
        status: string,
        message: string,
        seqToken?: string,
    ) {
        Logger.logMessage(`[${status}] ${message}`, seqToken);
    }
}
