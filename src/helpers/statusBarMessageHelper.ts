import { Organization } from "../constants";
import * as vscode from "vscode";

export class StatusBarMessageHelper {
    private statusBarMessage: vscode.Disposable | undefined;

    public setStatusBarMessage(message: string, timeout: number = 3000): void {
        if (this.statusBarMessage) {
            this.statusBarMessage.dispose();
        }
        this.statusBarMessage = vscode.window.setStatusBarMessage(message, timeout);
    }

    public showErrorMessage(message: string): void {
        vscode.window.showErrorMessage(`${Organization.nameCaps}: ` + message);
    }

    public showInformationMessage(message: string): void {
        vscode.window.showInformationMessage(`${Organization.nameCaps}: ` + message);
    }

    public async showInformationMessageWithItems(message: string, items: string[]): Promise<string | undefined> {
        return await vscode.window.showInformationMessage(`${Organization.nameCaps}: ` + message, ...items);
    }

    public showWarningMessage(message: string): void {
        vscode.window.showWarningMessage(`${Organization.nameCaps}: ` + message);
    }
}
