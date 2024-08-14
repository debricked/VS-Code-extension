import { Dependency } from "types/dependency";
import { MessageStatus } from "../constants/index";
import { GlobalState } from "./globalState";
import { ScannedData } from "types/scannedData";
import { DependencyVulnerability } from "types/vulnerability";

export class GlobalStore {
    private static instance: GlobalStore;
    private userId: string | undefined;
    private sequenceID: string | undefined;
    private globalStateInstance: GlobalState | undefined;
    private repositoryName: string = MessageStatus.UNKNOWN;
    private repoData: any;
    private repoId!: number;
    private commitId!: number;
    private scannedData!: ScannedData;
    private vulnerableData!: Map<string, DependencyVulnerability[]>;

    private constructor() {}

    public static getInstance(): GlobalStore {
        if (!GlobalStore.instance) {
            GlobalStore.instance = new GlobalStore();
        }
        return GlobalStore.instance;
    }

    /**
     * Set a new sequence ID.
     */
    public setSequenceID(sequenceID: string): void {
        this.sequenceID = sequenceID;
    }

    /**
     * Get the current sequence ID.
     * @returns The current sequence ID.
     */
    public getSequenceID(): string | undefined {
        return this.sequenceID;
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

    public setDependencyData(repoData: any) {
        this.repoData = repoData;
    }

    public getDependencyData(): Map<string, Dependency> {
        return this.repoData;
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

    public setScanData(data: ScannedData) {
        this.scannedData = data;
    }

    public getScanData(): ScannedData {
        return this.scannedData;
    }

    public setVulnerableData(data: Map<string, DependencyVulnerability[]>) {
        this.vulnerableData = data;
    }

    public getVulnerableData(): Map<string, DependencyVulnerability[]> {
        return this.vulnerableData;
    }
}
