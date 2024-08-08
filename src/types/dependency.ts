export interface Dependency {
    id: number;
    name: DependencyName;
    popularity: number;
    contributors: number;
    totalVulnerabilities: number;
    licenses: DependencyLicense[];
    indirectDependencies: IndirectDependency[];
}

export interface DependencyResponse {
    commitName: string;
    dependencies: Dependency[];
}
export interface DependencyName {
    name: string;
    shortName: string;
    link: string;
}

export interface DependencyLicense {
    name: string;
}

export interface IndirectDependency {
    id: number;
    name: DependencyName;
    contributors: number;
    popularity: number;
    totalVulnerabilities: number;
    licenses: DependencyLicense[];
}
