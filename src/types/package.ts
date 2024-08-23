export interface Package {
    version?: string;
    dependency: string;
    dependencyLink?: string;
    licenses?: string[];
    cve?: string;
    cvss2?: string;
    cvss3?: string;
    cveLink?: string;
    ruleActions?: string[];
    ruleLink?: string;
}
