import * as vscode from "vscode";
import * as fs from "fs";
import { MessageStatus, Organization } from "../constants/index";
import * as crypto from "crypto";
import { Logger } from "./loggerHelper";
import { GlobalStore } from "./globalStore";
import { DebrickedDataHelper } from "./debrickedDataHelper";

export class Common {
    private static globalStore = GlobalStore.getInstance();

    public static async getInput(prompt: string): Promise<string | undefined> {
        return await vscode.window.showInputBox({ prompt });
    }

    public static generateHashCode(input: string = new Date().toISOString()): string {
        return crypto.createHash("sha256").update(input).digest("hex");
    }

    public static async checkUserId(): Promise<void> {
        const user_id = await DebrickedDataHelper.getSpecificKeyFromDebrickedData("user_id");
        if (user_id === null) {
            const userHashCode = Common.generateHashCode(new Date().toDateString());
            DebrickedDataHelper.saveToDebrickedData("user_id", userHashCode);
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
        DebrickedDataHelper.createDir(Organization.reportsFolderPath);
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
