import { DebrickedCommandsTreeDataProvider } from "./debrickedCommandsTreeDataProvider";
import { ManifestDependencyHoverProvider } from "./manifestDependencyHoverProvider";
import * as vscode from "vscode";
import { MessageStatus } from "../constants/index";
import { Logger, errorHandler, gitHelper } from "../helpers";
import { DependencyPolicyProvider } from "./dependencyPolicyProvider";

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

    public async registerDependencyPolicyProvider(context: vscode.ExtensionContext) {
        try {
            Logger.logInfo("Started registering policy provider");
            const selectedRepoName = await gitHelper.getUpstream();

            if (selectedRepoName !== MessageStatus.UNKNOWN) {
                const diagnosticCollection = vscode.languages.createDiagnosticCollection("dependencyPolicyChecker");
                context.subscriptions.push(diagnosticCollection);

                const provider = new DependencyPolicyProvider(diagnosticCollection);

                context.subscriptions.push(
                    vscode.languages.registerCodeActionsProvider({ scheme: "file" }, provider, {
                        providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
                    }),
                );

                // Trigger the check when a file is opened or saved
                context.subscriptions.push(
                    vscode.workspace.onDidOpenTextDocument((doc) => provider.checkPolicyViolation(doc)),
                    vscode.workspace.onDidSaveTextDocument((doc) => provider.checkPolicyViolation(doc)),
                    vscode.window.onDidChangeActiveTextEditor((editor) => {
                        if (editor) {
                            provider.checkPolicyViolation(editor.document);
                        }
                    }),
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
