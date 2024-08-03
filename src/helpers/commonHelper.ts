import { MessageStatus, Organization } from "../constants/index";
import * as crypto from "crypto";
import { Logger } from "./loggerHelper";
import { GlobalState } from "./globalState";
import { ShowInputBoxHelper } from "./showInputBoxHelper";
import { DebrickedDataHelper } from "./debrickedDataHelper";
import * as vscode from "vscode";

export class Common {
    constructor(
        private debrickedDataHelper: DebrickedDataHelper,
        private logger: typeof Logger,
        private showInputBoxHelper: ShowInputBoxHelper,
        private globalState: typeof GlobalState,
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
            const userId = await this.globalState
                .getInstance()
                .getGlobalData(Organization.debrickedDataKey, "", Organization.userId);
            if (!userId) {
                const userHashCode = this.generateHashCode(new Date().toDateString());
                const debrickedData: any = await this.globalState
                    .getInstance()
                    .getGlobalData(Organization.debrickedDataKey, {});
                debrickedData[Organization.userId] = userHashCode;
                await this.globalState.getInstance().setGlobalData(Organization.debrickedDataKey, debrickedData);

                this.logger.logMessageByStatus(MessageStatus.INFO, `New user_id generated: ${userHashCode}`);
            }
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Replace the placeholder in a string with a specified value.
     * @param originalString The original string containing the placeholder.
     * @param placeholderValue The value to replace the placeholder with.
     * @returns The updated string with the placeholder replaced.
     */
    public static replacePlaceholder(originalString: string, placeholderValue: string): string {
        return originalString.replace("PLACEHOLDER", placeholderValue || new Date().toISOString());
    }

    /**
     * Set up the Debricked environment by generating a sequence ID and checking the user ID.
     */
    public async setupDebricked(context: vscode.ExtensionContext): Promise<void> {
        try {
            await this.checkUserId();
            this.debrickedDataHelper.createDir(Organization.reportsFolderPath);
            this.debrickedDataHelper.createDir(context.logUri.fsPath);
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Convert a string into an array by splitting it by a specified separator.
     * Trims whitespace and removes asterisks from each element.
     * @param inputString The input string to convert.
     * @param separator The separator to split the string by.
     * @returns The resulting array of strings.
     */
    public static stringToArray(inputString: string, separator: string): string[] {
        return inputString.split(separator).map((item) => item.trim().replace(/^\* /, ""));
    }
}
