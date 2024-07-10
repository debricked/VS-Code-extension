import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Organization } from "../constants/index";

export class FileHelper {
    /**
     * Stores content in a specified file within the 'debricked-result' folder.
     *
     * @param fileName The name of the file to store the content in.
     * @param content The content to write to the file.
     * @returns The path to the stored file.
     */
    public static async storeResultInFile(
        fileName: string,
        content: string,
    ): Promise<string> {
        const resultFolderPath = path.join(
            Organization.workspace,
            Organization.report,
        );

        if (!fs.existsSync(resultFolderPath)) {
            fs.mkdirSync(resultFolderPath);
        }

        const filePath = path.join(resultFolderPath, fileName);
        fs.writeFileSync(filePath, content, "utf8");

        return filePath;
    }

    public static async openTextDocument(filePath: any) {
        // Open the file in a new text document
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
    }

    public static async storeAndOpenFile(fileName: string, content: string) {
        const filePath = await FileHelper.storeResultInFile(fileName, content);
        await FileHelper.openTextDocument(filePath);
    }
}
