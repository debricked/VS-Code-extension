import * as vscode from "vscode";
import { Common, GlobalStore, Logger } from "./helpers";
import { DebrickedCommand } from "./commands";
import { DebrickedCommandsTreeDataProvider } from "./providers";
import { MessageStatus, Organization } from "./constants/index";
import { BaseCommandService } from "services";

export async function activate(context: vscode.ExtensionContext) {
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: "Debricked extension is getting ready",
            cancellable: false,
        },
        async (progress) => {
            progress.report({ message: "Activating VS Code Extension" });
            Logger.logMessageByStatus(MessageStatus.INFO, "Activate Debricked VS Code Extension");
            const globalStore = GlobalStore.getInstance();
            globalStore.setSeqToken(Common.generateHashCode());

            await Common.setupDebricked();
            await DebrickedCommand.commands(context, progress);

            const debCommandsProvider = new DebrickedCommandsTreeDataProvider();
            vscode.window.registerTreeDataProvider(Organization.debricked_command, debCommandsProvider);

            const currentVersion = await BaseCommandService.getCurrentExtensionVersion();
            const storedVersion = context.globalState.get<string>(
                Organization.EXTENSION_VERSION_KEY,
                Organization.base_version,
            );
            const isFirstActivation = context.globalState.get<boolean>(Organization.IS_FIRST_ACTIVATION_KEY, true);

            if (currentVersion !== storedVersion || isFirstActivation) {
                await BaseCommandService.installCommand(context, progress);
            }
        },
    );
}

// This method is called when your extension is deactivated
export function deactivate() {
    Logger.logMessageByStatus(MessageStatus.INFO, "Deactivate Debricked VS Code Extension");
    const globalStore = GlobalStore.getInstance();
    globalStore.setSeqToken(Common.generateHashCode());
}
