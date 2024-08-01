import * as vscode from "vscode";
import { ApiHelper, ErrorHandler, GlobalState, Logger, globalStore, commonHelper } from "./helpers";
import { DebrickedCommand, ManifestWatcher } from "./commands";
import { DebrickedCommandsTreeDataProvider } from "./providers";
import { MessageStatus, Organization } from "./constants/index";
import { BaseCommandService } from "services";
import { RequestParam } from "./types";

export async function activate(context: vscode.ExtensionContext) {
    // Set up global error handlers
    ErrorHandler.setupGlobalErrorHandlers();

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
            Logger.initialize(context);
            GlobalState.initialize(context);

            const globalState = GlobalState.getInstance();
            // For dev - Clears the globalData - uncomment to clear the globalData
            // await globalState.clearAllGlobalData();
            globalStore.setSequenceID();
            progress.report({
                message: "Activating VS Code Extension",
                increment: (progressCount += 20),
            });
            await commonHelper.setupDebricked();
            Logger.logMessageByStatus(MessageStatus.INFO, "Activate Debricked VS Code Extension");

            progress.report({
                message: "Registering Debricked commands",
                increment: (progressCount += 20),
            });
            await DebrickedCommand.commands(context);
            const debCommandsProvider = new DebrickedCommandsTreeDataProvider();
            vscode.window.registerTreeDataProvider(Organization.debrickedCommand, debCommandsProvider);

            const currentVersion = await BaseCommandService.getCurrentExtensionVersion();
            const debrickedData: any = globalState.getGlobalData(Organization.debrickedDataKey, {});

            if (currentVersion !== debrickedData.extensionVersion || debrickedData.isFirstActivation) {
                progress.report({
                    message: "Installing Debricked cli",
                    increment: (progressCount += 20),
                });
                await BaseCommandService.installCommand();
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
    globalStore.setSequenceID();
}

async function fetchRepositories() {
    try {
        const requestParam: RequestParam = {
            page: 1,
            rowsPerPage: 25,
            endpoint: "open/repository-settings/repositories",
        };

        const repositories = await ApiHelper.get(requestParam);
        Logger.logObj(repositories);
    } catch (error: any) {
        ErrorHandler.handleError(error);
    }
}
