import * as vscode from "vscode";
import { errorHandler, Logger, globalStore, indexHelper, SentryHelper } from "./helpers";
import { debrickedCommand } from "./commands";
import { DebrickedCommandsTreeDataProvider, providers } from "./providers";
import { Environment, MessageStatus, Organization } from "./constants/index";
import { baseCommandService } from "./services";
import { ReportWatcher, watchers, WorkSpaceWatcher } from "watcher";

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
                progress.report({
                    message: "Activating VS Code Extension",
                    increment: (progressCount += 20),
                });
                Logger.logMessageByStatus(MessageStatus.INFO, "Activate Debricked VS Code Extension");

                progress.report({
                    message: "Registering Debricked commands",
                    increment: (progressCount += 20),
                });

                await debrickedCommand.commands(context);
                await providers.registerHover(context);

                const debCommandsProvider = new DebrickedCommandsTreeDataProvider();
                vscode.window.registerTreeDataProvider(Organization.debrickedCommand, debCommandsProvider);

                const currentVersion = await baseCommandService.getCurrentExtensionVersion();
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
                    await baseCommandService.installCommand();
                }
                if (Organization.environment !== Environment.TEST) {
                    if (debrickedData.isFirstActivation === undefined || debrickedData.isFirstActivation) {
                        await baseCommandService.login(true);
                    } else {
                        await baseCommandService.login(false);
                    }
                }
                progress.report({ message: "Extension is ready to use", increment: (progressCount += 20) });
            } catch (error: any) {
                errorHandler.handleError(error);
            } finally {
                Logger.logMessageByStatus(MessageStatus.INFO, "activation has finished.");
            }
        },
    );
    // Add file watcher for all manifest files
    await watchers.registerWatcher(context);
    providers.registerDependencyPolicyProvider(context); // after adding watcher and scanning we should add the policy provider
}

// This method is called when your extension is deactivated
export async function deactivate(context: vscode.ExtensionContext) {
    const workSpaceWatcher = new WorkSpaceWatcher(context);
    await workSpaceWatcher.dispose();

    const reportWatcher = new ReportWatcher();
    await reportWatcher.stop();

    SentryHelper.setTransactionName(`Deactivate ${Organization.name}`);
    Logger.logMessageByStatus(MessageStatus.INFO, "Deactivate Debricked VS Code Extension");
    SentryHelper.close();
}
