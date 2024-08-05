import { GlobalState } from "./globalState";

export class GlobalStore {
    private static instance: GlobalStore;
    private userId: string | undefined;
    private sequenceID: string | undefined;
    private globalStateInstance: GlobalState | undefined;

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
}
