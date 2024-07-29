import { Logger } from "./loggerHelper";
import { StatusBarMessageHelper } from "./statusBarMessageHelper";

export class ErrorHandler {
    public static handleError(error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        StatusBarMessageHelper.showErrorMessage(errorMessage);
        Logger.logError(`Error: ${error instanceof Error ? error.stack : errorMessage}`);
    }
}
