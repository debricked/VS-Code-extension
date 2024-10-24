import * as vscode from "vscode";
import { DebrickedCommands } from "../constants";
import { dependencyService, policyRuleService } from "../services";
import { errorHandler, globalStore, Logger } from "../helpers";

export class ReportWatcher {
    private watcher: vscode.FileSystemWatcher | null = null;

    public async start(context: vscode.ExtensionContext): Promise<void> {
        const reportFilePath = DebrickedCommands.SCAN.flags?.[2]?.report;
        if (!reportFilePath) {
            Logger.logInfo("No report file path found");
            return;
        }

        this.watcher = vscode.workspace.createFileSystemWatcher(reportFilePath);

        this.watcher.onDidChange(async () => {
            const isRunning = globalStore.getScanningProgress();

            if (!isRunning) {
                globalStore.setScanningProgress(true);
                await this.handleReportChange();
            }
        });

        this.watcher.onDidDelete(() => {
            Logger.logInfo(`Report file deleted`);
        });
        context.subscriptions.push(this.watcher);
    }

    private async handleReportChange(): Promise<void> {
        try {
            await policyRuleService.setScannedData();
            const repoId = await globalStore.getRepoId();
            const commitId = await globalStore.getCommitId();
            await dependencyService.getDependencyData(repoId, commitId);
            await dependencyService.getVulnerableData();
        } catch (error) {
            errorHandler.handleError(error);
        } finally {
            globalStore.setScanningProgress(false);
        }
    }

    public stop(): void {
        if (this.watcher) {
            this.watcher.dispose();
        }
    }
}
