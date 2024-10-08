import * as vscode from "vscode";
import { SupportedFilesToScan } from "../constants";
import { scanService } from "services";
import { errorHandler, statusBarMessageHelper } from "../helpers";

export class WorkSpaceWatcher {
    private context: vscode.ExtensionContext;
    private packageJsonWatcher: vscode.FileSystemWatcher | null = null;
    private isRunning = false;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public setup(): void {
        this.setupPackageJsonWatcher();
        this.onPackageJsonChanged();
    }

    private setupPackageJsonWatcher(): void {
        this.packageJsonWatcher = vscode.workspace.createFileSystemWatcher(`**/${SupportedFilesToScan.PACKAGE_JSON}`);

        this.packageJsonWatcher.onDidCreate(() => {
            this.onPackageJsonChanged();
        });

        this.packageJsonWatcher.onDidChange(() => {
            this.onPackageJsonChanged();
        });

        this.packageJsonWatcher.onDidDelete((uri) => {
            console.log(`package.json deleted: ${uri.fsPath}`);
        });

        this.context.subscriptions.push(this.packageJsonWatcher);
    }

    private async onPackageJsonChanged(): Promise<void> {
        if (this.isRunning) {
            statusBarMessageHelper.showWarningMessage("Scan is still in process. Please wait...");
            return;
        }

        try {
            this.isRunning = true;
            await scanService.scan();
        } catch (error) {
            errorHandler.handleError(error);
        } finally {
            this.isRunning = false;
        }
    }
}
