import { Dependency, DependencyResponse, IndirectDependency } from "types/dependency";
import { apiHelper, globalStore, Logger } from "../helpers";
import { RequestParam } from "../types";
import { DependencyVulnerabilityWrapper } from "types/vulnerability";
import { Organization } from "../constants";

export class DependencyService {
    static async getDependencyData(repoID: number, commitId: number) {
        Logger.logInfo("Started fetching the Dependency Data");
        const requestParam: RequestParam = {
            endpoint: Organization.dependencyUrl,
            repoId: repoID,
            commitId: commitId,
        };
        const response: DependencyResponse = await apiHelper.get(requestParam);
        const dependencyMap = new Map<string, IndirectDependency>();

        // Converts the response to map
        response.dependencies.forEach((dep: Dependency) => {
            dependencyMap.set(dep.name.name, dep);
            if (dep.indirectDependencies.length > 0) {
                dep.indirectDependencies.forEach((indirectDep: IndirectDependency) => {
                    dependencyMap.set(indirectDep.name.name, indirectDep);
                });
            }
        });

        globalStore.setDependencyData(dependencyMap);
    }

    static async getVulnerableData(depId: number) {
        Logger.logInfo("Started fetching the Vulnerable Data");
        const repoId = await globalStore.getRepoId();
        const commitId = await globalStore.getCommitId();

        const requestParam: RequestParam = {
            endpoint: Organization.vulnerableUrl,
            repoId: repoId,
            commitId: commitId,
            dependencyId: depId,
        };
        const response: DependencyVulnerabilityWrapper = await apiHelper.get(requestParam);
        const vulnerableData = response.vulnerabilities;
        return vulnerableData;
    }
}
