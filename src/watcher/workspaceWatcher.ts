import * as vscode from "vscode";
import { SupportedFilesToScan } from "../constants";
import { scanService } from "services";
import { errorHandler, globalStore, statusBarMessageHelper } from "../helpers";
import * as path from "path";

export class WorkSpaceWatcher {
    private context: vscode.ExtensionContext;
    private packageJsonWatcher: vscode.FileSystemWatcher | null = null;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public async setup(): Promise<void> {
        this.setupPackageJsonWatcher();
        this.setupEditorListener();
        await this.onPackageJsonChanged();
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

    private setupEditorListener(): void {
        this.updateContext(vscode.window.activeTextEditor);
        vscode.window.onDidChangeActiveTextEditor(this.updateContext);
    }

    private updateContext(editor: vscode.TextEditor | undefined) {
        const filesPattern = new RegExp(SupportedFilesToScan.PACKAGE_JSON + "$");
        const shouldScan = editor && filesPattern.test(path.basename(editor.document.fileName));
        vscode.commands.executeCommand("setContext", "debrickedFilesToScan", shouldScan);
    }

    public async onPackageJsonChanged(): Promise<void> {
        const isRunning = globalStore.getScanningProgress();
        if (isRunning) {
            statusBarMessageHelper.showWarningMessage("Scan is still in process. Please wait...");
            return;
        }

        try {
            await scanService.scan();
        } catch (error) {
            errorHandler.handleError(error);
        } finally {
            globalStore.setScanningProgress(false);
        }
    }

    public dispose(): void {
        if (this.packageJsonWatcher) {
            this.packageJsonWatcher.dispose();
        }
    }
}
