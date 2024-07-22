import * as fs from "fs";
import * as path from "path";
import { Organization } from "../constants/index";
import { GlobalStore } from "./globalStore";
import { DebrickedDataHelper } from "./debrickedDataHelper";

export class Logger {
    private static globalStore = GlobalStore.getInstance();
    private static logFilePath = path.join(
        Organization.debricked_installed_dir,
        Organization.debrickedFolder,
        Organization.log_file,
    );

    public static async logMessage(message: string) {
        DebrickedDataHelper.createDir(Organization.debricked_installed_dir);

        const timestamp = new Date().toISOString();
        const userId = await DebrickedDataHelper.getSpecificKeyFromDebrickedData("user_id");
        const sequenceId = Logger.globalStore.getSeqToken() ? `[seq_id:${Logger.globalStore.getSeqToken()}]` : "";

        const logEntry = `[${timestamp}] [user_id:${userId}] ${sequenceId} ${message}\n`;
        fs.appendFileSync(Logger.logFilePath, logEntry, "utf-8");
    }

    public static logMessageByStatus(status: string, message: string) {
        Logger.logMessage(`[${status}] ${message}`);
    }
}
