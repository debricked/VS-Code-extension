import { MessageStatus, Organization } from "../constants/index";
import * as crypto from "crypto";
import { Logger } from "./loggerHelper";
import { GlobalState } from "./globalState";
import { DebrickedDataHelper } from "./debrickedDataHelper";
import { ShowInputBoxHelper } from "./showInputBoxHelper";
import { ErrorHandler } from "./errorHandler";

export class Common {
    // Singleton instance of GlobalState
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }

    /**
     * Prompt the user for input with a given prompt message.
     * @param prompt The message to prompt the user with.
     * @returns The user's input or undefined if cancelled.
     */
    public static async getInput(prompt: string): Promise<string | undefined> {
        return await ShowInputBoxHelper.promptForInput({ prompt });
    }

    /**
     * Generate a SHA-256 hash code from a given input or the current date and time.
     * @param input The input string to hash. Defaults to the current date and time.
     * @returns The generated hash code as a hex string.
     */
    public static generateHashCode(input: string = new Date().toISOString()): string {
        return crypto.createHash("sha256").update(input).digest("hex");
    }

    /**
     * Check if a user ID exists in the global state. If not, generate and store a new user ID.
     */
    public static async checkUserId(): Promise<void> {
        try {
            const userId = await Common.globalState.getGlobalData(
                Organization.debrickedDataKey,
                "",
                Organization.userId,
            );
            if (!userId) {
                const userHashCode = Common.generateHashCode(new Date().toDateString());
                const debrickedData: any = await Common.globalState.getGlobalData(Organization.debrickedDataKey, {});
                debrickedData[Organization.userId] = userHashCode;
                await Common.globalState.setGlobalData(Organization.debrickedDataKey, debrickedData);

                Logger.logMessageByStatus(MessageStatus.INFO, `New user_id generated: ${userHashCode}`);
            }
        } catch (error: any) {
            ErrorHandler.handleError(error);
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
    public static async setupDebricked(): Promise<void> {
        try {
            Common.globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());
            await Common.checkUserId();
            DebrickedDataHelper.createDir(Organization.reportsFolderPath);
        } catch (error: any) {
            ErrorHandler.handleError(error);
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
