import path from "path";
import * as fs from "fs";

export class DebrickedDataHelper {
    constructor() {}

    public createFile(filePath: string): void {
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    public createDir(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
}
