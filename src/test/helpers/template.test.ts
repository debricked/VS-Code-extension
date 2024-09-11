import { expect } from "../setup";

import { Template } from "../../helpers/template";
import { Vulnerabilities, Package } from "../../types";
import * as vscode from "vscode";
import { Icons } from "../../constants";

describe("Template", () => {
    let template: Template;
    let contents: vscode.MarkdownString;

    beforeEach(() => {
        template = new Template();
        contents = new vscode.MarkdownString("");
    });

    describe("licenseContent", () => {
        it("should append license content", () => {
            const license = "MIT";
            template.licenseContent(license, contents);
            expect(contents.value).to.contain(`${Icons.license} **License** : ${license}`);
        });
    });

    describe("vulnerableContent", () => {
        it("should append vulnerable content with no direct vulnerabilities", () => {
            const vulnerabilities: Vulnerabilities = {
                directVulnerabilities: [],
                indirectVulnerabilities: [],
            };
            template.vulnerableContent(vulnerabilities, contents);
            expect(contents.value).to.contain(
                `&nbsp;&nbsp;${Icons.debugBreakpoint} Direct Vulnerabilities : ${Icons.check} None found`,
            );
        });

        it("should append vulnerable content with direct vulnerabilities", () => {
            const vulnerabilities: Vulnerabilities = {
                directVulnerabilities: [
                    {
                        cveId: "CVE-2022-1234",
                        cvss: { text: 2, type: "CVSS v3.1" },
                        cpeVersions: [],
                        dependencies: [],
                        name: {
                            name: "",
                            link: "",
                        },
                    },
                ],
                indirectVulnerabilities: [],
            };
            template.vulnerableContent(vulnerabilities, contents);
            expect(contents.value).to.contain(`&nbsp;&nbsp;${Icons.debugBreakpoint} Direct Vulnerabilities Found : 1`);
        });

        it("should append vulnerable content with transitive vulnerabilities", () => {
            const vulnerabilities: Vulnerabilities = {
                directVulnerabilities: [],
                indirectVulnerabilities: [
                    {
                        dependencyName: "dependency-1",
                        transitiveVulnerabilities: [
                            {
                                cveId: "CVE-2022-1234",
                                cvss: { text: 2, type: "CVSS v3.1" },
                                cpeVersions: [],
                                dependencies: [],
                                name: {
                                    name: "",
                                    link: "",
                                },
                            },
                        ],
                    },
                ],
            };
            template.vulnerableContent(vulnerabilities, contents);
            expect(contents.value).to.contain(
                `&nbsp;&nbsp;${Icons.debugBreakpoint} Transitive Vulnerabilities Found : 1`,
            );
        });
    });

    describe("policyViolationContent", () => {
        it("should append policy violation content with no policy violations", () => {
            const policyViolationData: Package = { dependencyName: "" };
            template.policyViolationContent(policyViolationData, contents);
            expect(contents.value).to.contain(`${Icons.violation} **Policy Violations** : ${Icons.check} None found`);
        });

        it("should append policy violation content with policy violations", () => {
            const policyViolationData: Package = {
                dependencyName: "",
                policyRules: [
                    {
                        ruleActions: ["ACTION_1"],
                        ruleLink: "https://example.com/rule-1",
                    },
                ],
            };
            template.policyViolationContent(policyViolationData, contents);
            expect(contents.value).to.contain(`${Icons.violation} **Policy Violations**`);
        });
    });
});
