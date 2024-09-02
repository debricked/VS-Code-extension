import { apiHelper, globalStore, Logger } from "../helpers";
import { Package, RequestParam } from "../types";
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
        const packageData = globalStore.getPackages();

        response.dependencies.forEach((dependency: Dependency) => {
            const depName = dependency.name.name?.split(" ")[0];
            const foundPackage = packageData.get(depName);
            const newDependency: Package = {
                licenses: [],
                dependencyName: "",
            };

            if (foundPackage) {
                const licenses = dependency.licenses.map((license) => license.name);
                foundPackage.licenses = licenses;
                Object.assign(newDependency, foundPackage);
            } else {
                newDependency.licenses = dependency.licenses.map((license) => license.name);
                newDependency.dependencyName = depName;
            }

            if (dependency.indirectDependencies.length > 0) {
                const indirectDepsMap = new Map<string, Package>();

                dependency.indirectDependencies.forEach((indirectDep: IndirectDependency) => {
                    const indirectDepName = indirectDep.name.name?.split(" ")[0];
                    const newIndirectDep: Package = {
                        licenses: indirectDep.licenses.map((license) => license.name),
                        dependencyName: indirectDepName,
                    };
                    indirectDepsMap.set(indirectDepName, newIndirectDep);
                });
                newDependency.indirectDependency = indirectDepsMap;
            }

            packageData.set(depName, newDependency);
        });
        globalStore.setPackages(packageData);
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
                const name = dep.name.split(" ")[0];
                if (!vulnerabilityMap.has(name)) {
                    vulnerabilityMap.set(name, []);
                }
                const vulnerableData = vulnerabilityMap.get(name);
                if (vulnerableData) {
                    vulnerableData.push(vul);
                }
            });
        });

        globalStore.setVulnerableData(vulnerabilityMap);
    }
}
