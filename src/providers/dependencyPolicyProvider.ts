import { commonHelper, globalStore } from "../helpers";
import * as vscode from "vscode";

export class DependencyPolicyProvider implements vscode.CodeActionProvider {
    constructor(private diagnosticCollection: vscode.DiagnosticCollection) {}

    provideCodeActions(): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
        return [];
    }

    async checkPolicyViolation(document: vscode.TextDocument) {
        // Check if the current file is a manifest file
        const { isManifestFile, currentManifestFile } = await commonHelper.isCurrentDocManifestFile(document);

        if (!isManifestFile) {
            return;
        }

        if (currentManifestFile === "package.json") {
            const diagnostics: vscode.Diagnostic[] = [];
            const content = document.getText();
            const scanData = globalStore.getScanData();

            if (scanData) {
                const manifestData = JSON.parse(content) || {};
                const allDependencies = {
                    ...manifestData.dependencies,
                    ...manifestData.devDependencies,
                };

                for (const rule of scanData.automationRules) {
                    if (rule.triggered) {
                        for (const event of rule.triggerEvents) {
                            const packageName = this.extractPackageName(event.dependency);
                            if (packageName in allDependencies) {
                                const range = this.findDependencyRange(document, packageName);
                                if (range) {
                                    let diagnostic: vscode.Diagnostic;
                                    if (rule.ruleActions.includes("failPipeline")) {
                                        diagnostic = new vscode.Diagnostic(
                                            range,
                                            `Dependency ${packageName} failed the pipeline`,
                                            vscode.DiagnosticSeverity.Error,
                                        );
                                    } else if (rule.ruleActions.includes("warnPipeline")) {
                                        diagnostic = new vscode.Diagnostic(
                                            range,
                                            `Dependency ${packageName} triggered a pipeline warning`,
                                            vscode.DiagnosticSeverity.Warning,
                                        );
                                    } else {
                                        continue; // No diagnostic for 'pass' status
                                    }
                                    diagnostic.code = {
                                        value: event.cve,
                                        target: vscode.Uri.parse(event.cveLink),
                                    };
                                    diagnostics.push(diagnostic);
                                }
                            }
                        }
                    }
                }
            }

            // let uri = document.uri;
            // if (uri.path.endsWith(".git")) {
            //     uri = uri.with({ path: uri.path.slice(0, -4) });
            // }

            this.diagnosticCollection.set(document.uri, diagnostics);
        }
    }

    private findDependencyRange(document: vscode.TextDocument, dependency: string): vscode.Range | null {
        const text = document.getText();
        const dependencyPattern = new RegExp(`"${dependency}"\\s*:\\s*"[^"]*"`, "g");
        const match = dependencyPattern.exec(text);
        if (match) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            return new vscode.Range(startPos, endPos);
        }
        return null;
    }

    private extractPackageName(fullName: string): string {
        // Extracts package name from strings like "vite (npm)"
        return fullName.split(" ")[0];
    }
}
