export interface ScannedData {
    vulnerabilitiesFound: number;
    automationsAction: string;
    automationRules: AutomationRules[];
    detailsUrl: string;
}

interface AutomationRules {
    ruleDescription: string;
    ruleActions: string[];
    ruleLink: string;
    triggered: boolean;
    triggerEvents: TriggerEvents[];
}

interface TriggerEvents {
    dependency: string;
    dependencyLink: string;
    licenses: string[];
    cve: string;
    cvss2: number;
    cvss3: number;
    cveLink: string;
}

export interface PolicyViolation {
    ruleLink: string;
    ruleActions: string[];
}
