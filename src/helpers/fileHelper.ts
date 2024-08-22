import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { MessageStatus, Organization } from "../constants/index";
import { Logger } from "./loggerHelper";
import { DebrickedDataHelper } from "./debrickedDataHelper";
import { GlobalStore } from "./globalStore";
import { ScannedData } from "../types";

export class FileHelper {
    constructor(
        private debrickedDataHelper: DebrickedDataHelper,
        private logger: typeof Logger,
        private globalStore: GlobalStore,
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

    public async setRepoID() {
        const data: ScannedData = JSON.parse(
            fs.readFileSync(`${Organization.reportsFolderPath}/scan-output.json`, {
                encoding: "utf8",
                flag: "r",
            }),
        );
        const repoIdMatch = data.detailsUrl.match(/\/repository\/(\d+)\//);
        const repoId = repoIdMatch ? Number(repoIdMatch[1]) : null;

        const commitMatch = data.detailsUrl.match(/\/commit\/(\d+)/);
        const commitId = commitMatch ? Number(commitMatch[1]) : null;

        repoId ? this.globalStore.setRepoId(repoId) : null;
        commitId ? this.globalStore.setCommitId(commitId) : null;
        this.globalStore.setScanData(data);

        this.logger.logInfo("Found the repoId and commitId");
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
