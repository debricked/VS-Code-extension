import { Logger, StatusBarMessageHelper } from ".";

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

    public static setupGlobalErrorHandlers() {
        process.on("uncaughtException", (error: Error) => {
            Logger.logError(`Uncaught Exception: ${error}`);
            this.handleError(error);
            // Optionally, shut down the process if the error is critical
            // process.exit(1);
        });

        process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
            Logger.logError(`Unhandled Rejection at: ${promise} reason: ${reason}`);
            this.handleError(reason);
            // Optionally, shut down the process if the error is critical
            // process.exit(1);
        });
    }
}
