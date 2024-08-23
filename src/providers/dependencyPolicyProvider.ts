import { Package } from "types";
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
            const processedScannedData: Map<string, Package> = globalStore.getProcessedScanData();

            if (processedScannedData && processedScannedData.size > 0) {
                const manifestData = JSON.parse(content) || {};
                const allDependencies = {
                    ...manifestData.dependencies,
                    ...manifestData.devDependencies,
                };

                for (const [packageName, packageData] of processedScannedData) {
                    if (packageName in allDependencies) {
                        const range = this.findDependencyRange(document, packageName);
                        if (range) {
                            let diagnostic: vscode.Diagnostic;
                            if (packageData.ruleActions?.includes("failPipeline")) {
                                diagnostic = new vscode.Diagnostic(
                                    range,
                                    `Dependency ${packageName} failed the pipeline`,
                                    vscode.DiagnosticSeverity.Error,
                                );
                            } else if (packageData.ruleActions?.includes("warnPipeline")) {
                                diagnostic = new vscode.Diagnostic(
                                    range,
                                    `Dependency ${packageName} triggered a pipeline warning`,
                                    vscode.DiagnosticSeverity.Warning,
                                );
                            } else {
                                continue; // No diagnostic for 'pass' status
                            }
                            diagnostic.code = {
                                value: packageData.cve || "",
                                target: vscode.Uri.parse(packageData.cveLink || ""),
                            };
                            diagnostics.push(diagnostic);
                        }
                    }
                }
            }

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
}
