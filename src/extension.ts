import * as vscode from "vscode";
import { errorHandler, Logger, globalStore, commonHelper, indexHelper, SentryHelper } from "./helpers";
import { DebrickedCommand } from "./commands";
import { DebrickedCommandsTreeDataProvider, providers } from "./providers";
import { Environment, MessageStatus, Organization } from "./constants/index";
import { BaseCommandService } from "services";
import { watchers } from "watcher";

export async function activate(context: vscode.ExtensionContext) {
    await indexHelper.setupDebricked(context);

    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: Organization.nameCaps,
            cancellable: false,
        },
        async (progress) => {
            try {
                let progressCount = 0;
                progress.report({ increment: progressCount });

                const globalState = globalStore.getGlobalStateInstance();
                // For dev - Clears the globalData - uncomment to clear the globalData
                // await globalState?.clearAllGlobalData();
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
                await providers.registerHover(context);
                await providers.registerDependencyPolicyProvider(context);

                const debCommandsProvider = new DebrickedCommandsTreeDataProvider();
                vscode.window.registerTreeDataProvider(Organization.debrickedCommand, debCommandsProvider);

                const currentVersion = await BaseCommandService.getCurrentExtensionVersion();
                const debrickedData: any = globalState?.getGlobalData(Organization.debrickedDataKey, {});
                if (
                    currentVersion !== debrickedData.extensionVersion ||
                    debrickedData.isFirstActivation ||
                    !Organization.isDebrickedExistInCliPath()
                ) {
                    progress.report({
                        message: "Installing Debricked cli",
                        increment: (progressCount += 20),
                    });
                    await BaseCommandService.installCommand();
                }
                if (Organization.environment !== Environment.TEST) {
                    if (debrickedData.isFirstActivation === undefined || debrickedData.isFirstActivation) {
                        await BaseCommandService.login(true);
                    } else {
                        await BaseCommandService.login(false);
                    }
                }

                // Add file watcher for all files found from 'debricked files find'
                await watchers.registerWatcher(context);

                progress.report({ message: "Debricked extension is ready to use", increment: 100 - progressCount });
                await new Promise((resolve) => setTimeout(resolve, 1000)); // added for showing the last progress info
            } catch (error: any) {
                errorHandler.handleError(error);
            } finally {
                Logger.logMessageByStatus(MessageStatus.INFO, "activation has finished.");
            }
        },
    );
}

// This method is called when your extension is deactivated
export async function deactivate() {
    Logger.logMessageByStatus(MessageStatus.INFO, "Deactivate Debricked VS Code Extension");
    globalStore.setSequenceID(commonHelper.generateHashCode());
    SentryHelper.close();
}
