import * as vscode from "vscode";
import * as path from "path";
import { MessageStatus, DebrickedCommands } from "../constants";
import { ScanService, FileService } from "services";
import { ErrorHandler, Logger, StatusMessage, StatusBarMessageHelper } from "../helpers";

export class ManifestWatcher {
    private static instance: ManifestWatcher;
    private globalWatcher: vscode.FileSystemWatcher | null = null;
    private manifestWatchers: vscode.FileSystemWatcher[] = [];

    private constructor() {}

    public static getInstance(): ManifestWatcher {
        if (!ManifestWatcher.instance) {
            ManifestWatcher.instance = new ManifestWatcher();
        }
        return ManifestWatcher.instance;
    }

    public async setupWatchers(context: vscode.ExtensionContext): Promise<void> {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Setting up Manifest File Watchers");

            // Setup global watcher if not already set
            if (!this.globalWatcher) {
                this.setupGlobalWatcher(context);
            }

            const filesToScan = (await FileService.findFilesService()) || [];
            await this.updateManifestWatchers(filesToScan, context);

            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.COMPLETE, DebrickedCommands.SCAN.cli_command),
            );
        } catch (error: any) {
            ErrorHandler.handleError(error);
        } finally {
            StatusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.SCAN.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.INFO, "Watchers for Manifest files are now ready to scan.");
        }
    }

    private setupGlobalWatcher(context: vscode.ExtensionContext): void {
        this.globalWatcher = vscode.workspace.createFileSystemWatcher("**/*");
        this.globalWatcher.onDidCreate(async () => {
            await this.setupWatchers(context);
        });
        context.subscriptions.push(this.globalWatcher);
    }

    private async updateManifestWatchers(filesToScan: string[], context: vscode.ExtensionContext): Promise<void> {
        // Dispose old watchers
        this.manifestWatchers.forEach((watcher) => watcher.dispose());
        this.manifestWatchers = [];

        if (filesToScan.length > 0) {
            const filesPattern = new RegExp(filesToScan.map((file) => `^${file}$`).join("|"));

            vscode.window.onDidChangeActiveTextEditor((editor) => {
                if (editor && filesPattern.test(path.basename(editor.document.fileName))) {
                    vscode.commands.executeCommand("setContext", "debrickedFilesToScan", true);
                } else {
                    vscode.commands.executeCommand("setContext", "debrickedFilesToScan", false);
                }
            });

            filesToScan.forEach((file: string) => {
                const watcher = vscode.workspace.createFileSystemWatcher(`**/${file}`);
                const runScan = async () => {
                    await ScanService.scanService();
                };

                watcher.onDidChange(runScan);
                watcher.onDidCreate(runScan);
                watcher.onDidDelete(runScan);
                Logger.logMessageByStatus(MessageStatus.INFO, `Register watcher on ${file}`);
                context.subscriptions.push(watcher);
                this.manifestWatchers.push(watcher);
            });
            Logger.logInfo("Watchers added successfully");
        } else {
            Logger.logInfo("No manifest files found");
        }
    }
}
