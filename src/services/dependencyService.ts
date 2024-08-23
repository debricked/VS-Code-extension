import { apiHelper, globalStore, Logger } from "../helpers";
import { RequestParam } from "../types";
import {
    DependencyVulnerability,
    DependencyVulnerabilityWrapper,
    Dependency,
    DependencyResponse,
    IndirectDependency,
} from "../types";
import { SecondService } from "../constants";

export class DependencyService {
    static async getDependencyData(repoID: number, commitId: number) {
        Logger.logInfo("Started fetching the Dependency Data");
        const requestParam: RequestParam = {
            endpoint: SecondService.dependencyUrl,
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

    static async getVulnerableData() {
        Logger.logInfo("Started fetching the Vulnerable Data");
        const repoId = await globalStore.getRepoId();
        const commitId = await globalStore.getCommitId();

        const requestParam: RequestParam = {
            endpoint: SecondService.vulnerableUrl,
            repoId: repoId,
            commitId: commitId,
        };
        const response: DependencyVulnerabilityWrapper = await apiHelper.get(requestParam);
        const vulnerabilityMap = new Map<string, DependencyVulnerability[]>();

        response.vulnerabilities.forEach((vul: DependencyVulnerability) => {
            vul.dependencies.forEach((dep) => {
                const name = dep.name;
                if (!vulnerabilityMap.has(name)) {
                    vulnerabilityMap.set(name, []);
                }
                vulnerabilityMap.get(name)!.push(vul);
            });
        });

        globalStore.setVulnerableData(vulnerabilityMap);
    }
}
