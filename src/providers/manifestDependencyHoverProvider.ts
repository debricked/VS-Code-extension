import * as vscode from "vscode";
import { commonHelper, globalStore, template } from "../helpers";
import { Vulnerabilities, Package } from "../types";
import { Regex } from "../constants";

export class ManifestDependencyHoverProvider implements vscode.HoverProvider {
    public async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): Promise<vscode.Hover | null | undefined> {
        const { isManifestFile, currentManifestFile } = await commonHelper.isCurrentDocManifestFile(document);

        if (!isManifestFile) {
            return null;
        }

        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return null;
        }

        const lineText = document.lineAt(position.line).text;
        const dependencyName = this.parseDependencyName(lineText, currentManifestFile);

        if (!dependencyName) {
            return null;
        }

        const foundPackage = globalStore.getPackages().get(dependencyName);

        const licenseData = foundPackage?.licenses ? foundPackage?.licenses[0] : "Unknown";
        const vulnerableData = await this.getVulnerableData(foundPackage);

        const contents = this.createMarkdownString();
        template.licenseContent(licenseData, contents);
        template.vulnerableContent(vulnerableData, contents);
        if (foundPackage) {
            template.policyViolationContent(foundPackage, contents);
        }

        return new vscode.Hover(contents);
    }

    private async getVulnerableData(dependency?: Package): Promise<Vulnerabilities> {
        const vulnerabilities: Vulnerabilities = {
            directVulnerabilities: [],
            indirectVulnerabilities: [],
        };
        const vulnerabilityData = await globalStore.getVulnerableData();

        if (dependency) {
            // Direct dependencies
            vulnerabilities.directVulnerabilities = vulnerabilityData.get(dependency.dependencyName) ?? [];

            // Indirect dependencies
            if (dependency.indirectDependency) {
                for (const [dependencyName, indirectDep] of dependency.indirectDependency) {
                    const vulnerableData = vulnerabilityData.get(dependencyName) ?? [];

                    if (vulnerableData.length > 0) {
                        vulnerabilities.indirectVulnerabilities.push({
                            transitiveVulnerabilities: vulnerableData,
                            dependencyName: indirectDep.dependencyName,
                        });
                    }

                    if (vulnerabilities.indirectVulnerabilities.length > 1) {
                        break;
                    }
                }
            }
        }

        return vulnerabilities;
    }

    private createMarkdownString(): vscode.MarkdownString {
        const contents = new vscode.MarkdownString();
        contents.supportHtml = true;
        contents.isTrusted = true;
        contents.supportThemeIcons = true;
        return contents;
    }

    private parseDependencyName(lineText: string, fileName: string): string | null {
        lineText = lineText.trim();

        switch (fileName) {
            case "package.json": {
                const match = commonHelper.extractValueFromStringUsingRegex(lineText, Regex.packageJson);
                if (match) {
                    return match;
                }
                break;
            }

            case "go.mod": {
                const match = commonHelper.extractValueFromStringUsingRegex(lineText, Regex.goMod);
                if (match) {
                    return match + " (Go)";
                }
                break;
            }

            default:
                break;
        }
        return null;
    }
}
