import { Organization } from "../constants";
import { Vulnerabilities, Package } from "../types";
import * as vscode from "vscode";
import { SecondService } from "../constants";

export class Template {
    constructor() {}

    private policyViolation = {
        failPipeline: "Pipeline failing",
        warnPipeline: "Pipeline warning",
        markUnaffected: "Mark vulnerability as unaffected",
        markVulnerable: "Flag vulnerability as vulnerable",
        sendEmail: "Notified email",
        triggerWebhook: "Triggered webhook",
    };

    public licenseContent(license: string, contents: vscode.MarkdownString) {
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

    public policyViolationContent(policyViolationData: Package | any, contents: vscode.MarkdownString) {
        if (!policyViolationData) {
            contents.appendMarkdown("No policy violations found.\n");
            return;
        }

        contents.appendMarkdown("Policy Violations\n\n");

        contents.appendMarkdown("\n");
        policyViolationData?.ruleActions?.forEach((ruleAction: string, index: number) => {
            contents.appendMarkdown(
                `  ${index + 1}. **${this.policyViolation[ruleAction as keyof typeof this.policyViolation]}** - [View rule](${policyViolationData.ruleLink})`,
            );
            contents.appendMarkdown("\n");
        });
        contents.appendMarkdown("\n");
    }
}
