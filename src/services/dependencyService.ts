import { Dependency, DependencyResponse, IndirectDependency } from "types/dependency";
import { apiHelper, globalStore, Logger } from "../helpers";
import { RequestParam } from "../types";

export class DependencyService {
    static async getDependencyData(repoID: number, commitId: number) {
        Logger.logInfo("Started fetching the Dependency Data");
        const requestParam: RequestParam = {
            endpoint: "open/dependencies/get-dependencies-hierarchy",
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
}
