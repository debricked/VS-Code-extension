import * as vscode from "vscode";
import * as path from "path";
import { globalStore, template } from "../helpers";
import { DependencyService } from "services";
import { DependencyVulnerability } from "types/vulnerability";

export class ManifestDependencyHoverProvider implements vscode.HoverProvider {
    private manifestFiles: string[] = [];

    public async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): Promise<vscode.Hover | null | undefined> {
        const selectedRepoName = globalStore.getRepository();
        this.manifestFiles = await globalStore.getGlobalStateInstance()?.getGlobalData(selectedRepoName).filesToScan;
        const currentManifestFile = path.basename(document.fileName);

        // Check if the current file is a manifest file
        const isManifestFile = this.manifestFiles.some(
            (manifest: string) => path.basename(manifest) === currentManifestFile,
        );

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
        const licenseData = depData?.licenses[0]?.name ?? "License information unavailable";
        const vulnerableData = await this.getVulnerableData(depData?.id);

        const contents = this.createMarkdownString();
        template.licenseContent(licenseData, contents);
        template.vulnerableContent(vulnerableData, contents);

        return new vscode.Hover(contents);
    }

    private async getVulnerableData(dependencyId?: number): Promise<DependencyVulnerability[]> {
        if (dependencyId) {
            return await DependencyService.getVulnerableData(dependencyId);
        }
        return [];
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
            }
        }
        return null;
    }
}
