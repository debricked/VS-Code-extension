import { Logger } from "./loggerHelper";
import { StatusBarMessageHelper } from "./statusBarMessageHelper";

export class ErrorHandler {
    public static handleError(error: unknown) {
        const errorMessage = this.extractErrorMessage(error);
        const errorStack = error instanceof Error ? error.stack : "";

        this.logError(errorMessage, errorStack);
        this.showUserErrorMessage(errorMessage);
    }

    private static extractErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        } else if (typeof error === "string") {
            return error;
        } else {
            return "An unknown error occurred";
        }
    }

    private static logError(errorMessage: string, errorStack?: string) {
        Logger.logError(`Error: ${errorMessage}`);
        if (errorStack) {
            Logger.logError(`Stack Trace: ${errorStack}`);
        }
    }

    private static showUserErrorMessage(errorMessage: string) {
        StatusBarMessageHelper.showErrorMessage(`Error: ${errorMessage}`);
    }
}
