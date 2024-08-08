import { DebrickedCommandsTreeDataProvider } from "./debrickedCommandsTreeDataProvider";
import { ManifestDependencyHoverProvider } from "./manifestDependencyHoverProvider";
import * as vscode from "vscode";
import { MessageStatus } from "../constants/index";
import { Logger, errorHandler, gitHelper } from "../helpers";

class Providers {
    public async registerHover(context: vscode.ExtensionContext) {
        try {
            Logger.logInfo("Started registering commands");
            const selectedRepoName = await gitHelper.getUpstream();
            
            if (selectedRepoName !== MessageStatus.UNKNOWN) {
                // Register hover provider
                context.subscriptions.push(
                    vscode.languages.registerHoverProvider(
                        { scheme: "file" },
                        await new ManifestDependencyHoverProvider(),
                    ),
                );
            }
        } catch (error) {
            errorHandler.handleError(error);
        } finally {
            Logger.logInfo("Command registration has been completed");
        }
    }
}

const providers = new Providers();
export { DebrickedCommandsTreeDataProvider, ManifestDependencyHoverProvider, providers };
