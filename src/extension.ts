import * as vscode from "vscode";
import { Common, InstallHelper } from "./helpers";
import { registerCommands } from "./commands";
import { DebrickedCommandsTreeDataProvider } from "./providers";
import { Organization } from "./constants/index";

export async function activate(context: vscode.ExtensionContext) {
    Common.checkUserId();
    registerCommands(context);

    const debCommandsProvider = new DebrickedCommandsTreeDataProvider();
    vscode.window.registerTreeDataProvider(Organization.debricked_command, debCommandsProvider);

    const currentVersion = getCurrentExtensionVersion();
    const storedVersion = context.globalState.get<string>(
        Organization.EXTENSION_VERSION_KEY,
        Organization.base_version,
    );
    const isFirstActivation = context.globalState.get<boolean>(Organization.IS_FIRST_ACTIVATION_KEY, true);

    if (currentVersion !== storedVersion || isFirstActivation) {
        const installer = new InstallHelper();
        installer.runInstallScript().then(() => {
            context.globalState.update(Organization.IS_FIRST_ACTIVATION_KEY, false);
            context.globalState.update(Organization.EXTENSION_VERSION_KEY, currentVersion);
        });
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getCurrentExtensionVersion(): string {
    const extension = vscode.extensions.getExtension(`${Organization.name}.${Organization.extension_name}`);
    return extension ? extension.packageJSON.version : Organization.base_version;
}
