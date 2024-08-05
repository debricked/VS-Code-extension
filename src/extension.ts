import * as vscode from "vscode";
import { apiHelper, errorHandler, Logger, globalStore, commonHelper, indexHelper } from "./helpers";
import { DebrickedCommand, ManifestWatcher } from "./commands";
import { DebrickedCommandsTreeDataProvider } from "./providers";
import { MessageStatus, Organization } from "./constants/index";
import { BaseCommandService } from "services";
import { RequestParam } from "./types";
import { GlobalState } from "./helpers/globalState";

export async function activate(context: vscode.ExtensionContext) {
    // Set up global error handlers
    errorHandler.setupGlobalErrorHandlers();

    GlobalState.initialize(context);
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: Organization.nameCaps,
            cancellable: false,
        },
        async (progress) => {
            let progressCount = 0;
            progress.report({ increment: progressCount });
            await indexHelper.setupDebricked(context);

            const globalState = globalStore.getGlobalStateInstance();
            // For dev - Clears the globalData - uncomment to clear the globalData
            // await globalState.clearAllGlobalData();
            globalStore.setSequenceID(commonHelper.generateHashCode());
            progress.report({
                message: "Activating VS Code Extension",
                increment: (progressCount += 20),
            });
            Logger.logMessageByStatus(MessageStatus.INFO, "Activate Debricked VS Code Extension");

            progress.report({
                message: "Registering Debricked commands",
                increment: (progressCount += 20),
            });
            await DebrickedCommand.commands(context);
            const debCommandsProvider = new DebrickedCommandsTreeDataProvider();
            vscode.window.registerTreeDataProvider(Organization.debrickedCommand, debCommandsProvider);

            const currentVersion = await BaseCommandService.getCurrentExtensionVersion();
            const debrickedData: any = globalState?.getGlobalData(Organization.debrickedDataKey, {});

            if (currentVersion !== debrickedData.extensionVersion || debrickedData.isFirstActivation) {
                progress.report({
                    message: "Installing Debricked cli",
                    increment: (progressCount += 20),
                });
                await BaseCommandService.installCommand();
            }

            if (debrickedData.isFirstActivation === undefined || debrickedData.isFirstActivation) {
                await BaseCommandService.login(true);
            } else {
                await BaseCommandService.login(false);
            }

            await fetchRepositories();
            // Add file watcher for all files found from 'debricked files find'
            await ManifestWatcher.getInstance().setupWatchers(context);

            progress.report({ message: "Debricked extension is ready to use", increment: 100 - progressCount });
            await new Promise((resolve) => setTimeout(resolve, 1000)); // added for showing the last progress info
        },
    );
}

// This method is called when your extension is deactivated
export async function deactivate() {
    Logger.logMessageByStatus(MessageStatus.INFO, "Deactivate Debricked VS Code Extension");
    globalStore.setSequenceID(commonHelper.generateHashCode());
}

async function fetchRepositories() {
    try {
        const requestParam: RequestParam = {
            page: 1,
            rowsPerPage: 25,
            endpoint: "open/repository-settings/repositories",
        };

        const repositories = await apiHelper.get(requestParam);
        Logger.logObj(repositories);
    } catch (error: any) {
        errorHandler.handleError(error);
    }
}
