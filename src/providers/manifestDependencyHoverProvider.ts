import * as vscode from "vscode";
import * as path from "path";
import { globalStore } from "../helpers";

export class ManifestDependencyHoverProvider implements vscode.HoverProvider {
    private manifestFiles: string[] = [];

    public async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): Promise<vscode.Hover | null | undefined> {
        const selectedRepoName = globalStore.getRepository();
        this.manifestFiles = await globalStore.getGlobalStateInstance()?.getGlobalData(selectedRepoName).filesToScan;

        // Check if the current file is a manifest file
        if (!this.manifestFiles.includes(path.basename(document.fileName))) {
            return null;
        }

        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return null;
        }

        const lineText = document.lineAt(position.line).text;
        const dependencyMatch = lineText.match(/"([^"]+)":\s*"([^"]+)"/);

        if (dependencyMatch) {
            const [, dependencyName, version] = dependencyMatch;
            return new vscode.Hover([
                `**${dependencyName}**`,
                `Current version: ${version}`,
                `[View on npm](https://www.npmjs.com/package/${dependencyName})`,
                `[View on GitHub](https://github.com/search?q=${dependencyName})`,
            ]);
        }

        return null;
    }
}
