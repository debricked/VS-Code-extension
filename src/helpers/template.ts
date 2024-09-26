import { Vulnerabilities, Package } from "../types";
import * as vscode from "vscode";
import { SecondService, PolicyRules, Icons } from "../constants";

export class Template {
    public licenseContent(license: string, contents: vscode.MarkdownString) {
        this.appendMarkdown(contents, `${Icons.license} **License** : ${license}\n\n`);
    }

    public vulnerableContent(vulnerabilities: Vulnerabilities, contents: vscode.MarkdownString): void {
        this.appendMarkdown(contents, `${Icons.shield} **Vulnerability Report**\n\n`);
        // direct vulnerabilities
        if (vulnerabilities.directVulnerabilities.length === 0) {
            this.appendMarkdown(
                contents,
                `&nbsp;&nbsp;${Icons.debugBreakpoint} Direct Vulnerabilities : ${Icons.check} None found\n\n`,
            );
        } else {
            this.appendMarkdown(
                contents,
                `&nbsp;&nbsp;${Icons.debugBreakpoint} Direct Vulnerabilities Found : ${vulnerabilities.directVulnerabilities.length}\n\n`,
            );
            vulnerabilities.directVulnerabilities.slice(0, 2).forEach((vulnerability) => {
                this.appendVulnerability(contents, vulnerability);
            });
        }

        // transitive vulnerabilities
        if (vulnerabilities.indirectVulnerabilities.length === 0) {
            this.appendMarkdown(
                contents,
                `&nbsp;&nbsp;${Icons.debugBreakpoint} Transitive Vulnerabilities Found : ${Icons.check} None found\n\n`,
            );
        } else {
            this.appendMarkdown(
                contents,
                `&nbsp;&nbsp;${Icons.debugBreakpoint} Transitive Vulnerabilities Found : ${vulnerabilities.indirectVulnerabilities.length}\n\n`,
            );
            vulnerabilities.indirectVulnerabilities.forEach((indirectVulnerability) => {
                this.appendMarkdown(contents, `${indirectVulnerability.dependencyName}\n\n`);
                indirectVulnerability.transitiveVulnerabilities.forEach((vulnerability) => {
                    this.appendVulnerability(contents, vulnerability);
                });
            });
        }
    }

    public policyViolationContent(policyViolationData: Package, contents: vscode.MarkdownString) {
        if (!policyViolationData?.policyRules) {
            this.appendMarkdown(contents, `${Icons.violation} **Policy Violations** : ${Icons.check} None found\n\n`);
            return;
        }

        this.appendMarkdown(contents, `${Icons.violation} **Policy Violations**\n\n`);
        policyViolationData.policyRules?.slice(0, 2).forEach((rule) => {
            rule.ruleActions?.forEach((ruleAction: string) => {
                this.appendMarkdown(
                    contents,
                    `&nbsp;&nbsp;${Icons.debugBreakpoint} ${PolicyRules[ruleAction as keyof typeof PolicyRules]} - [View rule](${rule.ruleLink})`,
                );
            });
            this.appendMarkdown(contents, "\n\n");
        });
    }

    private appendMarkdown(contents: vscode.MarkdownString, markdown: string) {
        contents.appendMarkdown(markdown);
    }

    private appendVulnerability(contents: vscode.MarkdownString, vulnerability: any) {
        this.appendMarkdown(
            contents,
            `&nbsp;&nbsp;&nbsp;&nbsp;${Icons.chevronRight} [${vulnerability.cveId}](${SecondService.debrickedBaseUrl + vulnerability.name.link})`,
        );
        if (vulnerability.cvss) {
            this.appendMarkdown(contents, ` - CVSS: ${vulnerability.cvss.text} (${vulnerability.cvss.type})`);
        }
        this.appendMarkdown(contents, "\n\n");
    }
}
