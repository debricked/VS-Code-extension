export interface Package {
    version?: string;
    dependencyName: string;
    dependencyLink?: string;
    licenses?: string[];
    cve?: string;
    cvss2?: string;
    cvss3?: string;
    cveLink?: string;
    policyRules?: PolicyRules[];
    indirectDependency?: Map<string, Package>;
}

interface PolicyRules {
    ruleActions?: string[];
    ruleLink?: string;
}
