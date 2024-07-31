import * as fs from "fs";
import * as path from "path";
import { Organization, MessageStatus } from "../constants/index";
import { DebrickedDataHelper, GlobalState, GlobalStore } from ".";
import * as vscode from "vscode";

export class Logger {
    private static logDirPath = path.join(Organization.debrickedInstalledDir, Organization.debrickedFolder);
    private static logFilePath: string;
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }
    private static globalStore = GlobalStore.getInstance();

    public static initialize(context: vscode.ExtensionContext) {
        const logDir = context.logUri.fsPath;
        Logger.logFilePath = path.join(logDir, Organization.logFile);

        // Ensure the log directory exists
        DebrickedDataHelper.createDir(logDir);
    }

    public static async openLogFile() {
        const logUri = vscode.Uri.file(Logger.logFilePath);
        const document = await vscode.workspace.openTextDocument(logUri);
        await vscode.window.showTextDocument(document);
    }

    public static setLogFile(fileName: string) {
        Logger.logFilePath = path.join(Logger.logDirPath, fileName);
    }

    private static async writeLog(message: string) {
        const timestamp = new Date().toISOString();
        const userId = await Logger.globalState.getGlobalData(Organization.debrickedDataKey, "", Organization.userId);
        const sequenceId = Logger.globalStore.getSequenceID() ? `[seq_id:${Logger.globalStore.getSequenceID()}]` : "";

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

    public static async logObj(message: any) {
        await Logger.logMessageByStatus(MessageStatus.WARN, JSON.stringify(message));
    }

    public static async logDebug(message: any) {
        await Logger.logMessageByStatus(MessageStatus.DEBUG, JSON.stringify(message));
    }
}
