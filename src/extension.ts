import * as vscode from "vscode";
import { Common, GitHelper, GlobalStore, Logger } from "./helpers";
import { registerCommands } from "./commands";
import { DebrickedCommandsTreeDataProvider } from "./providers";
import { MessageStatus, Organization } from "./constants/index";
import { BaseCommandService } from "services";
import * as fs from "fs";

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

    let repositoryName: string | undefined;
    let debrickedData: any = {};
    if (fs.existsSync(Organization.debricked_data_filePath)) {
        const debrickedFileContent = fs.readFileSync(Organization.debricked_data_filePath, "utf-8");
        debrickedData = JSON.parse(debrickedFileContent);
        repositoryName = debrickedData.repositoryName;
    }

    if (!repositoryName) {
        const currentRepoName = await GitHelper.getUpstream();
        Logger.logMessageByStatus(MessageStatus.INFO, `Current repository name: ${currentRepoName}`);

        if (currentRepoName.indexOf(".git") > -1) {
            repositoryName = await GitHelper.getRepositoryName();
        } else {
            repositoryName = await vscode.window.showInputBox({
                prompt: "Enter Repository Name",
                ignoreFocusOut: true,
            });
        }

        if (repositoryName) {
            // Append the access token to the existing data
            debrickedData.repositoryName = repositoryName;
            // Store the updated data in the token.json file
            fs.writeFileSync(Organization.debricked_data_filePath, JSON.stringify(debrickedData, null, 2));
        }
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
