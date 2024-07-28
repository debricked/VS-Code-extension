import * as vscode from "vscode";
import { ApiHelper, Common, Logger } from "./helpers";
import { DebrickedCommand } from "./commands";
import { DebrickedCommandsTreeDataProvider } from "./providers";
import { MessageStatus, Organization } from "./constants/index";
import { BaseCommandService } from "services";
import { GlobalState } from "helpers/globalState";

export async function activate(context: vscode.ExtensionContext) {
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
            globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());
            progress.report({
                message: "Activating VS Code Extension",
                increment: (progressCount += 20),
            });
            await Common.setupDebricked();
            Logger.logMessageByStatus(MessageStatus.INFO, "Activate Debricked VS Code Extension");

            progress.report({
                message: "Registering Debricked commands",
                increment: (progressCount += 20),
            });
            await DebrickedCommand.commands(context);
            const debCommandsProvider = new DebrickedCommandsTreeDataProvider();
            vscode.window.registerTreeDataProvider(Organization.debrickedCommand, debCommandsProvider);

            const currentVersion = await BaseCommandService.getCurrentExtensionVersion();
            const storedVersion = globalState.getGlobalData(Organization.extensionVersionKey, Organization.baseVersion);
            const isFirstActivation = globalState.getGlobalData(Organization.isFirstActivationKey, true);

            if (currentVersion !== storedVersion || isFirstActivation) {
                globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());
                progress.report({
                    message: "Installing Debricked cli",
                    increment: (progressCount += 20),
                });
                await BaseCommandService.installCommand();
            }

            await fetchRepositories();
            progress.report({ message: "Debricked extension is ready to use", increment: 100 - progressCount });
            await new Promise((resolve) => setTimeout(resolve, 1000)); // added for showing the last progress info
        },
    );
}

// This method is called when your extension is deactivated
export async function deactivate() {
    Logger.logMessageByStatus(MessageStatus.INFO, "Deactivate Debricked VS Code Extension");
    const globalState = GlobalState.getInstance();
    await globalState.setGlobalData(Organization.seqIdKey, Common.generateHashCode());
}

async function fetchRepositories() {
    try {
        const response = await ApiHelper.getRepositories(1, 25, "asc");
        Logger.logDebug(response.data);
    } catch (error: any) {
        Logger.logError(`Failed to fetch repositories: ${error.stack}`);
    }
}
