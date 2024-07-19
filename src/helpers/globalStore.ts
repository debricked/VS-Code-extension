export class GlobalStore {
    private static instance: GlobalStore;
    private seqToken: string = "";
    private debrickedData: object = {};

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    // Singleton pattern to ensure a single instance
    public static getInstance(): GlobalStore {
        if (!GlobalStore.instance) {
            GlobalStore.instance = new GlobalStore();
        }
        return GlobalStore.instance;
    }

    public setSeqToken(hashCode: string): void {
        this.seqToken = hashCode;
    }

    public getSeqToken(): string {
        return this.seqToken;
    }

    public setDebrickedData(data: object): void {
        this.debrickedData = data;
    }

    public getFilesToScan(): object {
        return this.debrickedData;
    }
}
