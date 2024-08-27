import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { MessageStatus, Organization } from "../constants/index";
import { Logger } from "./loggerHelper";
import { DebrickedDataHelper } from "./debrickedDataHelper";

export class FileHelper {
    constructor(
        private debrickedDataHelper: DebrickedDataHelper,
        private logger: typeof Logger,
    ) {}
    /**
     * Stores content in a specified file within the 'debricked-result' folder.
     *
     * @param fileName The name of the file to store the content in.
     * @param content The content to write to the file.
     * @returns The path to the stored file.
     */
    public async storeResultInFile(fileName: string, content: string): Promise<string> {
        this.debrickedDataHelper.createDir(Organization.reportsFolderPath);
        const filePath = path.join(Organization.reportsFolderPath, fileName);
        fs.writeFileSync(filePath, content, "utf8");
        this.logger.logMessageByStatus(MessageStatus.INFO, `report saved in ${filePath}`);
        return filePath;
    }

    public async openTextDocument(filePath: any) {
        // Open the file in a new text document
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
        this.logger.logMessageByStatus(MessageStatus.INFO, `open document ${filePath}`);
    }

    public async storeAndOpenFile(fileName: string, content: string) {
        const filePath = await this.storeResultInFile(fileName, content);
        this.logger.logMessageByStatus(MessageStatus.INFO, `store results in ${filePath}`);
        await this.openTextDocument(filePath);
    }

    /**
     * Reads a JSON file and returns its contents as a JSON object.
     *
     * @param filePath The path to the JSON file.
     * @param options The options for reading the file.
     * @returns The JSON object.
     */
    public readFileSync(filePath: fs.PathOrFileDescriptor, options?: { encoding: "utf8"; flag: "r" }): string | Buffer {
        try {
            return fs.readFileSync(filePath, options);
        } catch (error: any) {
            throw new Error(`Failed to read JSON file at ${filePath}: ${error}`);
        }
    }
}
