import { stringify } from "querystring";
import { MessageStatus } from "../constants/index";
import { Logger } from "./loggerHelper";

export class GlobalStore {
    private static instance: GlobalStore;
    private seqToken: string = "";
    private debrickedData: any;

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
        Logger.logMessageByStatus(MessageStatus.INFO, `New sequence token has been set: ${this.seqToken}`);
    }

    public getSeqToken(): string {
        return this.seqToken;
    }

    public setDebrickedData(data: object): void {
        this.debrickedData = data;
        Logger.logMessageByStatus(
            MessageStatus.INFO,
            `New Debricked data has been set: ${stringify(this.debrickedData)}`,
        );
    }

    public getDebrickedData(): any {
        return this.debrickedData;
    }

    public getFilesToScan(): object {
        return this.debrickedData;
    }
}
