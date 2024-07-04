import * as vscode from "vscode";

let statusBarMessage: vscode.Disposable | undefined;

export function setStatusBarMessage(message: string, timeout: number = 3000) {
    if (statusBarMessage) {
        statusBarMessage.dispose();
    }
    statusBarMessage = vscode.window.setStatusBarMessage(message, timeout);
}

export function showErrorMessage(message: string) {
    vscode.window.showErrorMessage(message);
}
