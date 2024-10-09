import { MessageStatus, Organization, SupportedFilesToScan } from "../constants/index";
import * as crypto from "crypto";
import { Logger } from "./loggerHelper";
import { ShowInputBoxHelper } from "./showInputBoxHelper";
import { GlobalStore } from "./globalStore";
import path from "path";
import * as vscode from "vscode";
import { StatusBarMessageHelper } from "./statusBarMessageHelper";

export class Common {
    constructor(
        private logger: typeof Logger,
        private showInputBoxHelper: ShowInputBoxHelper,
        private globalStore: GlobalStore,
        private statusBarMessageHelper: StatusBarMessageHelper,
    ) {}

    /**
     * Prompt the user for input with a given prompt message.
     * @param prompt The message to prompt the user with.
     * @returns The user's input or undefined if cancelled.
     */
    public async getInput(prompt: string): Promise<string | undefined> {
        return await this.showInputBoxHelper.promptForInput({ prompt });
    }

    /**
     * Generate a SHA-256 hash code from a given input or the current date and time.
     * @param input The input string to hash. Defaults to the current date and time.
     * @returns The generated hash code as a hex string.
     */
    public generateHashCode(input: string = new Date().toISOString()): string {
        return crypto.createHash("sha256").update(input).digest("hex");
    }

    /**
     * Check if a user ID exists in the global state. If not, generate and store a new user ID.
     */
    public async checkUserId(): Promise<void> {
        try {
            const globalState = this.globalStore.getGlobalStateInstance();
            let userId = await globalState?.getGlobalData(Organization.debrickedDataKey, "", Organization.userId);
            if (!userId) {
                userId = this.generateHashCode(new Date().toDateString());
                const debrickedData: any = await globalState?.getGlobalData(Organization.debrickedDataKey, {});
                debrickedData[Organization.userId] = userId;
                await globalState?.setGlobalData(Organization.debrickedDataKey, debrickedData);

                this.logger.logMessageByStatus(MessageStatus.INFO, `New user_id generated: ${userId}`);
            } else {
                this.logger.logMessageByStatus(MessageStatus.INFO, `Existing user_id: ${userId}`);
            }
            this.globalStore.setUserId(userId);
        } catch (error) {
            this.logger.logError("Error in checkUserId");
            throw error;
        }
    }

    /**
     * Replace the placeholder in a string with a specified value.
     * @param originalString The original string containing the placeholder.
     * @param placeholderValue The value to replace the placeholder with.
     * @returns The updated string with the placeholder replaced.
     */
    public replacePlaceholder(originalString: string, placeholderValue: string): string {
        return originalString.replace("PLACEHOLDER", placeholderValue || new Date().toISOString());
    }

    public async isCurrentDocManifestFile(document: vscode.TextDocument) {
        const manifestFiles = Object.values(SupportedFilesToScan);
        let currentManifestFile = path.basename(document.fileName);
        currentManifestFile = currentManifestFile.endsWith(".git")
            ? currentManifestFile.slice(0, -4)
            : currentManifestFile;

        // Check if the current file is a manifest file
        const isManifestFile = manifestFiles.some(
            (manifest: string) => path.basename(manifest) === currentManifestFile,
        );

        return { isManifestFile, currentManifestFile };
    }

    /**
     * Extracts a value from a string using a regular expression.
     *
     * @param url The URL to extract the value from.
     * @param regex The regular expression to use for extraction.
     * @returns The extracted value, or null if the regular expression does not match.
     */
    public extractValueFromStringUsingRegex(str: string, regex: RegExp, groupIndex = 1): string | null {
        // Check if the str is a non-empty string
        if (typeof str !== "string" || str === "") {
            throw new Error("Invalid string");
        }

        // Check if the regular expression is valid
        if (!(regex instanceof RegExp)) {
            throw new Error("Invalid regular expression");
        }

        // Apply the regular expression to the string
        const match = str.match(regex);

        // Return the first capturing group if the regular expression matches
        return match && match[groupIndex] ? match[groupIndex] : null;
    }
    /**
     * Checks if the current repository is supported by looking for a package.json file.
     * @param showMsg Whether to show an information message if the repository is not supported. Defaults to true.
     * @returns A promise that resolves to true if the repository is supported (contains a package.json file), false otherwise.
     */
    public async isCurrentRepoSupported(showMsg = true): Promise<boolean> {
        const uri = (
            await vscode.workspace.findFiles(`**/${SupportedFilesToScan.PACKAGE_JSON}`, "**/node_modules/**", 1)
        ).length;
        if (!uri) {
            if (showMsg) {
                this.statusBarMessageHelper.showInformationMessage("No files found to scan.");
            }
            return false;
        }

        return true;
    }
}
