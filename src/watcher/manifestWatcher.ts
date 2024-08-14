import * as vscode from "vscode";
import * as path from "path";
import { MessageStatus, DebrickedCommands, Organization } from "../constants";
import { ScanService, FileService, DependencyService } from "../services";
import { errorHandler, Logger, StatusMessage, statusBarMessageHelper, fileHelper, globalStore } from "../helpers";

export class ManifestWatcher {
    private static instance: ManifestWatcher;
    private static files: string[] = [];
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
                this.workSpaceWatcher(context);
            }
            this.reportsWatcher(context);
            const filesToScan = (await FileService.findFilesService()) || [];
            let diffScan: string[] = [];
            diffScan = filesToScan.filter((file) => !ManifestWatcher.files.includes(file));
            ManifestWatcher.files = filesToScan;

            await this.updateManifestWatchers(diffScan, context);

            statusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.COMPLETE, DebrickedCommands.SCAN.cli_command),
            );
        } catch (error: any) {
            errorHandler.handleError(error);
        } finally {
            statusBarMessageHelper.setStatusBarMessage(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.SCAN.cli_command),
            );
            Logger.logMessageByStatus(MessageStatus.INFO, "Watchers for Manifest files are now ready to scan.");
        }
    }

    private workSpaceWatcher(context: vscode.ExtensionContext): void {
        this.globalWatcher = vscode.workspace.createFileSystemWatcher("**/*");
        this.globalWatcher.onDidCreate(async () => {
            await this.setupWatchers(context);
        });
        context.subscriptions.push(this.globalWatcher);
    }

    private async updateManifestWatchers(filesToScan: string[], context: vscode.ExtensionContext): Promise<void> {
        // Dispose old watchers
        this.manifestWatchers.forEach((watcher) => {
            Logger.logInfo("Deleted the watchers ");
            watcher.dispose();
        });
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
                watcher.onDidDelete(async () => {
                    this.manifestWatchers.push(watcher);
                    await this.setupWatchers(context);
                });
                Logger.logMessageByStatus(MessageStatus.INFO, `Register watcher on ${file}`);
                context.subscriptions.push(watcher);
            });
            Logger.logInfo("Watchers added successfully");
        } else {
            Logger.logInfo("No new manifest files found");
        }
    }

    private async reportsWatcher(context: vscode.ExtensionContext) {
        const watcher = vscode.workspace.createFileSystemWatcher(`${Organization.reportsFolderPath}/scan-output.json`);
        watcher.onDidChange(async () => {
            await fileHelper.setRepoID();

            const repoId = await globalStore.getRepoId();
            const commitId = await globalStore.getCommitId();

            await DependencyService.getDependencyData(repoId, commitId);
            await DependencyService.getVulnerableData();
        });
        context.subscriptions.push(watcher);
    }
}
