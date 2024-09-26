import { MessageStatus } from "../constants/index";
import { GlobalState } from "./globalState";
import { DependencyVulnerability, Package } from "../types";

export class GlobalStore {
    private static instance: GlobalStore;
    private userId: string | undefined;
    private globalStateInstance: GlobalState | undefined;
    private repositoryName: string = MessageStatus.UNKNOWN;
    private repoId!: number;
    private commitId!: number;
    private packages!: Map<string, Package>;
    private vulnerableData!: Map<string, DependencyVulnerability[]>;

    public static getInstance(): GlobalStore {
        if (!GlobalStore.instance) {
            GlobalStore.instance = new GlobalStore();
        }
        return GlobalStore.instance;
    }

    /**
     * Set a new GlobalState Instance.
     */
    public setGlobalStateInstance(globalStateInstance: GlobalState): void {
        this.globalStateInstance = globalStateInstance;
    }

    /**
     * Get the current GlobalState Instance.
     * @returns The current GlobalState Instance.
     */
    public getGlobalStateInstance(): GlobalState | undefined {
        return this.globalStateInstance;
    }

    /**
     * Set a new userId.
     */
    public setUserId(userId: string): void {
        this.userId = userId;
    }

    /**
     * Get the current userId.
     * @returns The current userId.
     */
    public getUserId(): string | undefined {
        return this.userId;
    }

    /**
     * Set a new repositoryName.
     */
    public setRepository(repositoryName: string): void {
        this.repositoryName = repositoryName;
    }

    /**
     * Get the current repositoryName.
     * @returns The current repositoryName.
     */
    public getRepository(): string {
        return this.repositoryName;
    }

    public getRepoId() {
        return this.repoId;
    }

    public setRepoId(repoId: number) {
        this.repoId = repoId;
    }

    public getCommitId() {
        return this.commitId;
    }

    public setCommitId(commitId: number) {
        this.commitId = commitId;
    }

    public setPackages(data: Map<string, Package>) {
        this.packages = data;
    }

    public getPackages(): Map<string, Package> {
        return this.packages;
    }

    public setVulnerableData(data: Map<string, DependencyVulnerability[]>) {
        this.vulnerableData = data;
    }

    public getVulnerableData(): Map<string, DependencyVulnerability[]> {
        return this.vulnerableData;
    }
}
