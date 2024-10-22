import { Logger } from "./logger.helper";
import { StatusBarMessageHelper } from "./statusBarMessage.helper";
import { SentryHelper } from "./sentry.helper";

export class ErrorHandler {
    constructor(
        private statusBarMessageHelper: StatusBarMessageHelper,
        private logger: typeof Logger,
        private sentryHelper: typeof SentryHelper,
    ) {}
    public handleError(error: any, customErrorMessage?: string) {
        const errorMessage = this.extractErrorMessage(error);

        this.logError(errorMessage);
        this.showUserErrorMessage(customErrorMessage ?? errorMessage);
        this.sentryHelper.captureException(new Error(`Error Found :`, error));
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

    private logError(errorMessage: string) {
        this.logger.logError(`Error: ${errorMessage}`);
    }

    private showUserErrorMessage(errorMessage: string) {
        this.statusBarMessageHelper.showErrorMessage(`${errorMessage}`);
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
