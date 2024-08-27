import { Organization } from "../constants";
import { Vulnerabilities, Package } from "../types";
import * as vscode from "vscode";
import { SecondService, PolicyRules } from "../constants";

export class Template {
    constructor() {}

    public licenseContent(license: string, contents: vscode.MarkdownString) {
        contents.appendText(Organization.separator);
        contents.appendMarkdown(`License: **${license}**`);
        contents.appendText(Organization.separator);
    }

    public vulnerableContent(vulnerabilities: Vulnerabilities, contents: vscode.MarkdownString): void {
        // direct vulnerabilities
        if (vulnerabilities.directVulnerabilities.length === 0) {
            contents.appendMarkdown("No vulnerabilities found\n\n");
        } else {
            contents.appendMarkdown(
                `Direct Vulnerabilities Found: **${vulnerabilities.directVulnerabilities.length}**\n\n`,
            );

            const vulnerabilitiesToShow = vulnerabilities.directVulnerabilities.slice(0, 2);
            vulnerabilitiesToShow.forEach((vulnerability) => {
                contents.appendMarkdown(
                    `[**${vulnerability.cveId}**](${SecondService.debrickedBaseUrl + vulnerability.name.link})`,
                );

                if (vulnerability.cvss) {
                    contents.appendMarkdown(` - CVSS: ${vulnerability.cvss.text} (${vulnerability.cvss.type})`);
                }

                contents.appendMarkdown("\n\n");
            });
        }

        contents.appendText(Organization.separator);

        // transitive vulnerabilities
        if (vulnerabilities.indirectVulnerabilities.length === 0) {
            contents.appendMarkdown("No transitive vulnerabilities found");
        } else {
            contents.appendMarkdown(
                `Transitive Vulnerabilities Found: **${vulnerabilities.indirectVulnerabilities.length}**`,
            );
            contents.appendMarkdown("\n\n");
            vulnerabilities.indirectVulnerabilities.forEach((indirectVulnerability) => {
                const vulnerabilitiesToShow = indirectVulnerability;
                contents.appendMarkdown(`${indirectVulnerability.dependencyName}`);
                contents.appendMarkdown("\n\n");

                vulnerabilitiesToShow.transitiveVulnerabilities.forEach((vulnerability) => {
                    contents.appendMarkdown(
                        `[**${vulnerability.cveId}**](${SecondService.debrickedBaseUrl + vulnerability.name.link})`,
                    );

                    if (vulnerability.cvss) {
                        contents.appendMarkdown(` - CVSS: ${vulnerability.cvss.text} (${vulnerability.cvss.type})`);
                    }

                    contents.appendMarkdown("\n\n");
                });
            });
        }

        contents.appendText(Organization.separator);
    }

    public policyViolationContent(policyViolationData: Package, contents: vscode.MarkdownString) {
        if (policyViolationData?.policyRules === undefined) {
            contents.appendMarkdown("No policy violations found.\n");
            contents.appendText(Organization.separator);
            return;
        }

        contents.appendMarkdown("Policy Violations\n\n");

        contents.appendMarkdown("\n");
        policyViolationData.policyRules?.forEach((rule, index) => {
            if (index < 2) {
                rule.ruleActions?.forEach((ruleAction: string, index: number) => {
                    contents.appendMarkdown(
                        `  ${index + 1}. **${PolicyRules[ruleAction as keyof typeof PolicyRules]}** - [View rule](${rule.ruleLink})`,
                    );
                });
                contents.appendMarkdown("\n\n");
            }
        });
        contents.appendText(Organization.separator);
    }
}
