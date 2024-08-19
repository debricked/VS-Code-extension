import * as vscode from "vscode";
import { commonHelper, globalStore, template } from "../helpers";
import { DependencyService } from "services";
import { TransitiveVulnerabilities, Vulnerabilities, Dependency } from "../types";

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

        const depData = globalStore.getDependencyData().get(dependencyName);
        const licenseData = depData?.licenses[0]?.name ?? "Unknown";
        const vulnerableData = await this.getVulnerableData(depData);
        const policyViolationData = DependencyService.getPolicyViolationData(dependencyName);

        const contents = this.createMarkdownString();
        template.licenseContent(licenseData, contents);
        template.vulnerableContent(vulnerableData, contents);
        template.policyViolationContent(policyViolationData, contents);

        return new vscode.Hover(contents);
    }

    private async getVulnerableData(dependency?: Dependency): Promise<Vulnerabilities> {
        const vulnerabilities: Vulnerabilities = {
            directVulnerabilities: [],
            indirectVulnerabilities: [],
        };
        const vulnerabilityData = globalStore.getVulnerableData();
        //direct dependencies
        if (dependency) {
            vulnerabilities.directVulnerabilities = vulnerabilityData.get(dependency.name.name) ?? [];
        }
        //indirect dependencies
        if (dependency?.indirectDependencies) {
            const vulnerabilitiesToFetch = dependency.indirectDependencies;

            for (const indirectDep of vulnerabilitiesToFetch) {
                const vulnerableData = vulnerabilityData.get(indirectDep.name.name) ?? [];

                if (vulnerableData.length !== 0) {
                    const transitiveVulnerableData: TransitiveVulnerabilities = {
                        transitiveVulnerabilities: vulnerableData,
                        dependencyName: indirectDep.name.name,
                        dependencyId: indirectDep.id,
                    };
                    vulnerabilities.indirectVulnerabilities.push(transitiveVulnerableData);
                }

                if (vulnerabilities.indirectVulnerabilities.length > 1) {
                    break;
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
                const packageJsonRegex = /"([^"]+)":\s*"([^"]+)"/;
                const match = lineText.match(packageJsonRegex);
                if (match) {
                    return match[1] + " (npm)";
                }
                break;
            }

            case "go.mod": {
                const goModRegex =
                    /^(?:require\s+)?(\S+)\s+(v?\d+(?:\.\d+)*(?:-[\w\.-]+)?(?:\+[\w\.-]+)?)(?:\s+\/\/\s+indirect)?/;
                const match = lineText.match(goModRegex);
                if (match) {
                    return match[1] + " (Go)";
                }
                break;
            }

            default:
                break;
        }
        return null;
    }
}
