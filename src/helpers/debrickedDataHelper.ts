import { MessageStatus, Organization } from "../constants/index";
import path from "path";
import * as fs from "fs";
import { Logger } from "./loggerHelper";

export class DebrickedDataHelper {
    private static debrickedDataPath = path.join(
        Organization.debricked_installed_dir,
        Organization.debrickedFolder,
        Organization.debricked_data_file,
    );

    public static async saveToDebrickedData(key: string, value: string): Promise<void> {
        const debrickedData: any = await DebrickedDataHelper.getDataFromDir(DebrickedDataHelper.debrickedDataPath);
        debrickedData[key] = value;
        fs.writeFileSync(DebrickedDataHelper.debrickedDataPath, JSON.stringify(debrickedData, null, 2), "utf-8");
    }

    private static async getDataFromDir(filePath: string): Promise<object> {
        if (await fs.existsSync(filePath)) {
            const data = JSON.parse(await fs.readFileSync(filePath, "utf-8"));
            return data;
        } else {
            DebrickedDataHelper.createFile(filePath);
        }

        return {};
    }

    public static createFile(filePath: string): void {
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            Logger.logMessageByStatus(MessageStatus.INFO, `New file created : ${filePath}`);
        }
    }

    static createDir(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            Logger.logMessageByStatus(MessageStatus.INFO, `New Directory created : ${dirPath}`);
        }
    }

    public static async getSpecificKeyFromDebrickedData(key: string): Promise<string | null> {
        const debrickedData: any = await DebrickedDataHelper.getDataFromDir(DebrickedDataHelper.debrickedDataPath);

        if (key !== "" && debrickedData && debrickedData[key]) {
            return debrickedData[key];
        }

        return null;
    }
}
