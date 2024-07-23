import * as fs from "fs";
import * as path from "path";
import { Organization, MessageStatus } from "../constants/index";
import { GlobalStore } from "./globalStore";
import { DebrickedDataHelper } from "./debrickedDataHelper";

export class Logger {
    private static globalStore = GlobalStore.getInstance();
    private static logDirPath = path.join(Organization.debricked_installed_dir, Organization.debrickedFolder);
    private static logFilePath = path.join(Logger.logDirPath, Organization.log_file);

    public static setLogFile(fileName: string) {
        Logger.logFilePath = path.join(Logger.logDirPath, fileName);
    }

    private static async writeLog(message: string) {
        DebrickedDataHelper.createDir(Organization.debricked_installed_dir);

        const timestamp = new Date().toISOString();
        const userId = await DebrickedDataHelper.getSpecificKeyFromDebrickedData("user_id");
        const sequenceId = Logger.globalStore.getSeqToken() ? `[seq_id:${Logger.globalStore.getSeqToken()}]` : "";

        const logEntry = `[${timestamp}] [user_id:${userId}] ${sequenceId} ${message}\n`;
        fs.appendFileSync(Logger.logFilePath, logEntry, "utf-8");
    }

    public static async logMessage(message: string) {
        await Logger.writeLog(message);
    }

    public static async logMessageByStatus(status: string, message: string) {
        await Logger.writeLog(`[${status}] ${message}`);
    }

    public static async logInfo(message: string) {
        await Logger.logMessageByStatus(MessageStatus.INFO, message);
    }

    public static async logWarn(message: string) {
        await Logger.logMessageByStatus(MessageStatus.WARN, message);
    }

    public static async logError(message: string) {
        await Logger.logMessageByStatus(MessageStatus.ERROR, message);
    }
}
