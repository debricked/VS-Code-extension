import { Logger } from "./loggerHelper";
import { StatusBarMessageHelper } from "./statusBarMessageHelper";

export class ErrorHandler {
    constructor(
        private statusBarMessageHelper: StatusBarMessageHelper,
        private logger: typeof Logger,
    ) {}
    public handleError(error: unknown) {
        const errorMessage = this.extractErrorMessage(error);
        const errorStack = error instanceof Error ? error.stack : "";

        this.logError(errorMessage, errorStack);
        this.showUserErrorMessage(errorMessage);
    }

    private extractErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        } else if (typeof error === "string") {
            return error;
        } else {
            return "An unknown error occurred";
        }
    }

    private logError(errorMessage: string, errorStack?: string) {
        this.logger.logError(`Error: ${errorMessage}`);
        if (errorStack) {
            this.logger.logError(`Stack Trace: ${errorStack}`);
        }
    }

    private showUserErrorMessage(errorMessage: string) {
        this.statusBarMessageHelper.showErrorMessage(`Error: ${errorMessage}`);
    }

    public setupGlobalErrorHandlers() {
        process.on("uncaughtException", (error: Error) => {
            this.logger.logError(`Uncaught Exception: ${error}`);
            this.handleError(error);
            // Optionally, shut down the process if the error is critical
            // process.exit(1);
        });

        process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
            this.logger.logError(`Unhandled Rejection at: ${promise} reason: ${reason}`);
            this.handleError(reason);
            // Optionally, shut down the process if the error is critical
            // process.exit(1);
        });
    }
}
