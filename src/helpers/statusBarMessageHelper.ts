import * as vscode from "vscode";

export class StatusBarMessageHelper {
    private static statusBarMessage: vscode.Disposable | undefined;

    public static setStatusBarMessage(
        message: string,
        timeout: number = 3000,
    ): void {
        if (StatusBarMessageHelper.statusBarMessage) {
            StatusBarMessageHelper.statusBarMessage.dispose();
        }
        StatusBarMessageHelper.statusBarMessage =
            vscode.window.setStatusBarMessage(message, timeout);
    }

    public static showErrorMessage(message: string): void {
        vscode.window.showErrorMessage(message);
    }
}
