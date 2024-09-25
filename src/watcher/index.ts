import { ManifestWatcher } from "./manifestWatcher";
import { WorkSpaceWatcher } from "./workspaceWatcher";
import * as vscode from "vscode";
import { MessageStatus } from "../constants/index";
import { Logger, errorHandler, globalStore } from "../helpers";
import { scanService } from "../services";

class Watchers {
    public async registerWatcher(context: vscode.ExtensionContext) {
        try {
            const selectedRepoName = globalStore.getRepository();

            if (selectedRepoName !== MessageStatus.UNKNOWN) {
                await ManifestWatcher.getInstance().setupWatchers(context);
                await scanService.scan();
            }
        } catch (error) {
            errorHandler.handleError(error);
        } finally {
            Logger.logInfo("Watcher added successfully");
        }
    }
}

const watchers = new Watchers();
export { ManifestWatcher, WorkSpaceWatcher, watchers };
