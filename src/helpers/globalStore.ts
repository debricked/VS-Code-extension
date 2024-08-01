import { Common } from "./commonHelper";

export class GlobalStore {
    private static instance: GlobalStore;
    private sequenceID: string | undefined;

    private constructor(private commonHelper: Common) {}

    public static getInstance(commonHelper: Common): GlobalStore {
        if (!GlobalStore.instance) {
            GlobalStore.instance = new GlobalStore(commonHelper);
        }
        return GlobalStore.instance;
    }

    /**
     * Set a new sequence ID.
     */
    public setSequenceID(): void {
        this.sequenceID = this.commonHelper.generateHashCode();
    }

    /**
     * Get the current sequence ID.
     * @returns The current sequence ID.
     */
    public getSequenceID(): string | undefined {
        return this.sequenceID;
    }
}
