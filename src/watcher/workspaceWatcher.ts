import * as vscode from "vscode";
import { SupportedFilesToScan } from "../constants";
import { scanService } from "services";
import { errorHandler, globalStore, Logger, statusBarMessageHelper } from "../helpers";
import * as path from "path";
import { DependencyPolicyProvider } from "../providers";

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
            Logger.logInfo(`deleted: ${uri.fsPath}`);
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
            this.updatePackageJsonContent(this.context);
        } catch (error) {
            errorHandler.handleError(error);
        } finally {
            globalStore.setScanningProgress(false);
        }
    }

    private async updatePackageJsonContent(context: vscode.ExtensionContext): Promise<void> {
        const diagnosticCollection = vscode.languages.createDiagnosticCollection("dependencyPolicyChecker");
        context.subscriptions.push(diagnosticCollection);

        const provider = new DependencyPolicyProvider(diagnosticCollection);
        //added to activate the policy violation provider when the manifest file is already open
        if (vscode.window.activeTextEditor?.document) {
            await provider.checkPolicyViolation(vscode.window.activeTextEditor?.document);
        }
    }

    public dispose(): void {
        if (this.packageJsonWatcher) {
            this.packageJsonWatcher.dispose();
        }
    }
}
