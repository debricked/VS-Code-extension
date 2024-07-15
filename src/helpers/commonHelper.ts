import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Organization } from "../constants/index";
import * as crypto from "crypto";

export class Common {
    private static debrickedDataPath = path.join(
        Organization.workspace,
        Organization.debrickedFolder,
        Organization.debricked_data_file,
    );

    private static ensureDirectoryExists(filePath: string): void {
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
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

    public static generateHashCode(input: string): string {
        return crypto.createHash("sha256").update(input).digest("hex");
    }

    public static async checkUserId(): Promise<void> {
        const user_id = await Common.getFromDebrickedData("user_id");
        if (user_id && user_id === "unknown-user") {
            const userHashCode = Common.generateHashCode(new Date().toDateString());
            Common.saveToDebrickedData("user_id", userHashCode);
        }
    }
}
