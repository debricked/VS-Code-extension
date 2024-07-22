import * as vscode from "vscode";
import { Common, GlobalStore } from "./helpers";
import { registerCommands } from "./commands";
import { DebrickedCommandsTreeDataProvider } from "./providers";
import { Organization } from "./constants/index";
import { BaseCommandService } from "services";

export async function activate(context: vscode.ExtensionContext) {
    const globalStore = GlobalStore.getInstance();
    await Common.setupDebricked();
    await registerCommands(context);

    const debCommandsProvider = new DebrickedCommandsTreeDataProvider();
    vscode.window.registerTreeDataProvider(Organization.debricked_command, debCommandsProvider);

    const currentVersion = await BaseCommandService.getCurrentExtensionVersion();
    const storedVersion = context.globalState.get<string>(
        Organization.EXTENSION_VERSION_KEY,
        Organization.base_version,
    );
    const isFirstActivation = context.globalState.get<boolean>(Organization.IS_FIRST_ACTIVATION_KEY, true);

    if (currentVersion !== storedVersion || isFirstActivation) {
        globalStore.setSeqToken(Common.generateHashCode());
        await BaseCommandService.installCommand(context);
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
