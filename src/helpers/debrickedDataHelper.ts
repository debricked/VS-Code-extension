import { MessageStatus } from "../constants/index";
import path from "path";
import * as fs from "fs";
import { Logger } from "./loggerHelper";

export class DebrickedDataHelper {
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
}
