import { WorkSpaceWatcher } from "./workspaceWatcher";
import * as vscode from "vscode";
import { MessageStatus } from "../constants/index";
import { Logger, errorHandler, globalStore } from "../helpers";
import { ReportWatcher } from "./reportWatcher";

class Watchers {
    public async registerWatcher(context: vscode.ExtensionContext) {
        try {
            const selectedRepoName = globalStore.getRepository();

            if (selectedRepoName !== MessageStatus.UNKNOWN) {
                const workSpaceWatcher = new WorkSpaceWatcher(context);
                await workSpaceWatcher.setup();

                const reportWatcher = new ReportWatcher();
                await reportWatcher.start(context);
            }
        } catch (error) {
            errorHandler.handleError(error);
        } finally {
            Logger.logInfo("Watcher added successfully");
        }
    }
}

const watchers = new Watchers();
export { WorkSpaceWatcher, watchers, ReportWatcher };
