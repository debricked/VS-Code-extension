import { Common } from ".";

export class GlobalStore {
    private static instance: GlobalStore;
    private static seqId: string;
    private constructor() {}

    public static getInstance() {
        if (!GlobalStore.instance) {
            GlobalStore.instance = new GlobalStore();
        }
        return GlobalStore.instance;
    }

    public setSequenceID() {
        GlobalStore.seqId = Common.generateHashCode();
    }

    public getSequenceID() {
        return GlobalStore.seqId;
    }
}
