import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { MessageStatus, Organization } from "../constants/index";
import { Logger } from "./loggerHelper";
import { DebrickedDataHelper } from "./debrickedDataHelper";

export class FileHelper {
    /**
     * Stores content in a specified file within the 'debricked-result' folder.
     *
     * @param fileName The name of the file to store the content in.
     * @param content The content to write to the file.
     * @returns The path to the stored file.
     */
    public static async storeResultInFile(fileName: string, content: string): Promise<string> {
        DebrickedDataHelper.createDir(Organization.reportsFolderPath);
        const filePath = path.join(Organization.reportsFolderPath, fileName);
        fs.writeFileSync(filePath, content, "utf8");
        Logger.logMessageByStatus(MessageStatus.INFO, `report saved in ${filePath}`);
        return filePath;
    }

    public static async openTextDocument(filePath: any) {
        // Open the file in a new text document
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        Logger.logMessageByStatus(MessageStatus.INFO, `open document ${filePath}`);
    }

    public static async storeAndOpenFile(fileName: string, content: string) {
        const filePath = await FileHelper.storeResultInFile(fileName, content);
        Logger.logMessageByStatus(MessageStatus.INFO, `store results in ${filePath}`);
        await FileHelper.openTextDocument(filePath);
    }
}
