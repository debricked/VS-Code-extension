import * as fs from "fs";

export class DebrickedDataHelper {
    public createDir(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
}
