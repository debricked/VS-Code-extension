import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { MessageStatus, Organization } from "../constants/index";
import * as crypto from "crypto";
import { Logger } from "./loggerHelper";
import { GlobalStore } from "./globalStore";

export class Common {
    private static globalStore = GlobalStore.getInstance();

    private static debrickedDataPath = path.join(
        Organization.debricked_installed_dir,
        Organization.debrickedFolder,
        Organization.debricked_data_file,
    );

    private static ensureDirectoryExists(filePath: string): void {
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            Logger.logMessageByStatus(MessageStatus.INFO, `New file created : ${filePath}`);
        }
    }

    static createDirectory(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            Logger.logMessageByStatus(MessageStatus.INFO, `New Directory created : ${dirPath}`);
        }
    }

    public static async getInput(prompt: string): Promise<string | undefined> {
        return await vscode.window.showInputBox({ prompt });
    }

    public static async saveToDebrickedData(key: string, value: string): Promise<void> {
        Common.ensureDirectoryExists(Common.debrickedDataPath);
        let data: any = {};
        if (fs.existsSync(Common.debrickedDataPath)) {
            data = JSON.parse(fs.readFileSync(Common.debrickedDataPath, "utf-8"));
        }
        data[key] = value;
        fs.writeFileSync(Common.debrickedDataPath, JSON.stringify(data, null, 2), "utf-8");
    }

    public static async getFromDebrickedData(key: string): Promise<string | undefined> {
        if (fs.existsSync(Common.debrickedDataPath) && key !== "") {
            const data = JSON.parse(fs.readFileSync(Common.debrickedDataPath, "utf-8"));
            return data[key];
        }

        return "unknown-user";
    }

    public static generateHashCode(input: string = new Date().toISOString()): string {
        return crypto.createHash("sha256").update(input).digest("hex");
    }

    public static async checkUserId(): Promise<void> {
        const user_id = await Common.getFromDebrickedData("user_id");
        if (user_id && user_id === "unknown-user") {
            const userHashCode = Common.generateHashCode(new Date().toDateString());
            Common.saveToDebrickedData("user_id", userHashCode);
            Logger.logMessageByStatus(MessageStatus.INFO, `New user_id generated : ${userHashCode}`);
        }
    }

    public static replacePlaceholder(originalString: string, placeholderValue: string) {
        const test = originalString.replace("PLACEHOLDER", placeholderValue);
        return test;
    }

    public static async setupDebricked(): Promise<void> {
        Common.globalStore.setSeqToken(Common.generateHashCode());
        await Common.checkUserId();
        Common.createDirectory(Organization.reportsFolderPath);
    }

    public static stringToArray(inputString: string, separator: string) {
        // Split the string by newline character
        let array = inputString.split(separator);

        // Trim whitespace and asterisks from each element
        array = array.map((item) => item.trim().replace(/^\* /, ""));

        return array;
    }

    public static async readDataFromDebrickedJSON() {
        if (fs.existsSync(Organization.debricked_data_filePath)) {
            Logger.logMessageByStatus(
                MessageStatus.INFO,
                `Fetching Debricked data from ${Organization.debricked_data_filePath}`,
            );
            return await fs.readFileSync(Organization.debricked_data_filePath, "utf-8");
        }
        Logger.logMessageByStatus(MessageStatus.ERROR, `No files found`);
        return null;
    }

    public static async writeDataToDebrickedJSON(debrickedData: object) {
        Common.globalStore.setDebrickedData(debrickedData);
        await fs.writeFileSync(Organization.debricked_data_filePath, JSON.stringify(debrickedData, null, 2));
    }
}
