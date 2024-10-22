import * as fs from "fs";
import * as path from "path";
import { Organization, MessageStatus } from "../constants/index";
import * as vscode from "vscode";
import { GlobalStore } from "./globalStore";
import { SentryHelper } from "./sentry.helper";

export class Logger {
    private static logFilePath: string;

    public static async initialize(context: vscode.ExtensionContext) {
        const logDir = context.logUri.fsPath;
        Logger.logFilePath = await path.join(logDir, Organization.logFile);
    }

    public static async openLogFile() {
        const logUri = vscode.Uri.file(Logger.logFilePath);
        const document = await vscode.workspace.openTextDocument(logUri);
        await vscode.window.showTextDocument(document);
    }

    public static async writeLog(message: string) {
        const timestamp = new Date().toISOString();
        const userId = GlobalStore.getInstance().getUserId() || "";

        const logEntry = `[${timestamp}] [user_id:${userId}] ${message}\n`;
        await fs.appendFileSync(Logger.logFilePath, logEntry, "utf-8");
    }

    public static async logMessage(message: string) {
        await this.writeLog(message);
    }

    public static async logMessageByStatus(status: MessageStatus, message: any) {
        await this.writeLog(`[${status}] ${message}`);
        SentryHelper.captureMessageBySeverityLevel(status, message);
    }

    public static async logInfo(message: string) {
        await this.logMessageByStatus(MessageStatus.INFO, message);
    }

    public static async logWarn(message: string) {
        await this.logMessageByStatus(MessageStatus.WARN, message);
    }

    public static async logError(message: string) {
        await this.logMessageByStatus(MessageStatus.ERROR, message);
    }

    public static async logObj(message: any) {
        await this.logMessageByStatus(MessageStatus.WARN, JSON.stringify(message));
    }

    public static async logDebug(message: any) {
        await this.logMessageByStatus(MessageStatus.DEBUG, JSON.stringify(message));
    }
}
