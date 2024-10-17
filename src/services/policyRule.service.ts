import { Logger, globalStore, commonHelper, fileHelper } from "../helpers";
import { DebrickedCommands, Regex } from "../constants/index";
import { Package } from "../types";

export class PolicyRuleService {
    constructor() {
        this.setProcessedPackagesFromScannedOutput = this.setProcessedPackagesFromScannedOutput.bind(this);
        this.setScannedData = this.setScannedData.bind(this);
    }
    // sets scanned output data, repoID, CommitID
    public async setScannedData() {
        const scannedFilePath = DebrickedCommands.SCAN.flags ? DebrickedCommands.SCAN.flags[2].report : "";
        let data;
        if (scannedFilePath) {
            data = JSON.parse(fileHelper.readFileSync(scannedFilePath).toString());
        }
        const url = data.detailsUrl;

        const repoId = Number(commonHelper.extractValueFromStringUsingRegex(url, Regex.repoId));
        const commitId = Number(commonHelper.extractValueFromStringUsingRegex(url, Regex.commitId));

        repoId ? globalStore.setRepoId(repoId) : null;
        commitId ? globalStore.setCommitId(commitId) : null;

        this.setProcessedPackagesFromScannedOutput(data.automationRules);
        Logger.logInfo("Found the repoId and commitId");
    }

    public setProcessedPackagesFromScannedOutput(automationRules: any[]) {
        const actions = ["warnPipeline", "failPipeline"];

        const triggerEventsMap = automationRules
            .filter((rule) => actions.some((action) => rule.ruleActions.includes(action)))
            .flatMap((rule) =>
                rule.triggerEvents.map((event: any) => {
                    const { dependency, ...restOfEvent } = event;
                    const { ruleActions, ruleLink } = rule;
                    return {
                        ...restOfEvent,
                        dependencyName: dependency.split(" ")[0],
                        policyRules: [{ ruleActions, ruleLink }],
                    };
                }),
            )
            .reduce((map, event) => {
                // for storing the multiple rules
                const existingPackage = map.get(event.dependencyName);
                if (existingPackage) {
                    const existingPolicyRules = existingPackage.policyRules || [];
                    const newPolicyRule = event.policyRules[0];

                    if (!existingPolicyRules.some((rule: any) => rule.ruleLink === newPolicyRule.ruleLink)) {
                        existingPackage.policyRules = [...existingPolicyRules, newPolicyRule];
                    }
                } else {
                    map.set(event.dependencyName, event);
                }

                return map;
            }, new Map<string, Package>());

        globalStore.setPackages(triggerEventsMap);
    }
}
