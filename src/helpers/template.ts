import { Organization } from "../constants";
import { DependencyVulnerability } from "types/vulnerability";
import * as vscode from "vscode";

export class Template {
    constructor() {}
    public licenseContent(data: string, contents: vscode.MarkdownString) {
        contents.appendMarkdown(`License: **${data}**`);
        contents.appendText("\n______________________________\n");
    }

    public vulnerableContent(data: DependencyVulnerability[], contents: vscode.MarkdownString): void {
        if (data.length === 0) {
            contents.appendMarkdown("No vulnerabilities found");
            return;
        }

        contents.appendMarkdown(`Vulnerabilities Found: **${data.length}**\n\n`);

        const vulnerabilitiesToShow = data.slice(0, 2);
        vulnerabilitiesToShow.forEach((vulnerability) => {
            contents.appendMarkdown(
                `[**${vulnerability.cveId}**](${Organization.debrickedBaseUrl + vulnerability.name.link})`,
            );

            if (vulnerability.cvss) {
                contents.appendMarkdown(` - CVSS: ${vulnerability.cvss.text} (${vulnerability.cvss.type})`);
            }

            contents.appendMarkdown("\n\n");
        });
    }
}
