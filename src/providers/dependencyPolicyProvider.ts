import { Package } from "types";
import { commonHelper, globalStore } from "../helpers";
import * as vscode from "vscode";
import { PolicyTriggerEvents, SecondService, SupportedFilesToScan } from "../constants";

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

        if (currentManifestFile === SupportedFilesToScan.PACKAGE_JSON) {
            const diagnostics: vscode.Diagnostic[] = [];
            const content = document.getText();
            const packages: Map<string, Package> = globalStore.getPackages();

            if (packages && packages.size > 0) {
                const manifestData = JSON.parse(content) || {};
                const allDependencies = {
                    ...manifestData.dependencies,
                    ...manifestData.devDependencies,
                };

                for (const [packageName, packageData] of packages) {
                    if (packageName in allDependencies) {
                        const range = this.findDependencyRange(document, packageName);
                        if (range) {
                            let diagnostic: vscode.Diagnostic | undefined;
                            packageData.policyRules?.forEach((rule) => {
                                if (rule.ruleActions?.includes(PolicyTriggerEvents.FAIL_PIPELINE)) {
                                    diagnostic = new vscode.Diagnostic(
                                        range,
                                        `Dependency ${packageName} failed the pipeline`,
                                        vscode.DiagnosticSeverity.Error,
                                    );
                                } else if (rule.ruleActions?.includes(PolicyTriggerEvents.WARN_PIPELINE)) {
                                    diagnostic = new vscode.Diagnostic(
                                        range,
                                        `Dependency ${packageName} triggered a pipeline warning`,
                                        vscode.DiagnosticSeverity.Warning,
                                    );
                                }
                            });

                            if (diagnostic) {
                                diagnostic.code = {
                                    value: packageData.cve ?? "Unknown reason",
                                    target: vscode.Uri.parse(packageData.cveLink ?? SecondService.debrickedBaseUrl),
                                };
                                diagnostics.push(diagnostic);
                            }
                        }
                    }
                }
            }

            const uri = document.uri;
            if (!uri.path.endsWith(".git")) {
                this.diagnosticCollection.set(uri, diagnostics);
            }
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
