import * as vscode from "vscode";
import { Common, Logger } from "./helpers";
import { DebrickedCommand } from "./commands";
import { DebrickedCommandsTreeDataProvider } from "./providers";
import { MessageStatus, Organization } from "./constants/index";
import { BaseCommandService } from "services";
import { GlobalState } from "helpers/globalState";

export async function activate(context: vscode.ExtensionContext) {
    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: "Debricked extension is getting ready",
            cancellable: false,
        },
        async (progress) => {
            progress.report({ message: "Activating VS Code Extension", increment: 5 });
            Logger.initialize(context);
            GlobalState.initialize(context);

            const globalState = GlobalState.getInstance();
            globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());
            await Common.setupDebricked();

            Logger.logMessageByStatus(MessageStatus.INFO, "Activate Debricked VS Code Extension");

            await DebrickedCommand.commands(context, progress);
            const debCommandsProvider = new DebrickedCommandsTreeDataProvider();
            vscode.window.registerTreeDataProvider(Organization.debricked_command, debCommandsProvider);

            const currentVersion = await BaseCommandService.getCurrentExtensionVersion();
            const storedVersion = globalState.getGlobalData(
                Organization.EXTENSION_VERSION_KEY,
                Organization.base_version,
            );
            const isFirstActivation = globalState.getGlobalData(Organization.IS_FIRST_ACTIVATION_KEY, true);

            if (currentVersion !== storedVersion || isFirstActivation) {
                globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());
                await BaseCommandService.installCommand(progress);
            }
            progress.report({ message: `debricked is now ready to use`, increment: 5 });
        },
    );
}

// This method is called when your extension is deactivated
export async function deactivate() {
    Logger.logMessageByStatus(MessageStatus.INFO, "Deactivate Debricked VS Code Extension");
    const globalState = GlobalState.getInstance();
    // for testing environment
    await globalState.clearAllGlobalData();
    globalState.setGlobalData(Organization.SEQ_ID_KEY, Common.generateHashCode());
}
