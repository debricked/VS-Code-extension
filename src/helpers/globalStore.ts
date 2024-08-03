export class GlobalStore {
    private static instance: GlobalStore;
    private sequenceID: string | undefined;

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
}
