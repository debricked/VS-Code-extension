import { Common } from "./commonHelper";
import * as vscode from "vscode";

export class GlobalStore {
    private static instance: GlobalStore;
    private sequenceID: string | undefined;
    private context: vscode.ExtensionContext | undefined;

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

    /**
     * Set a new context.
     */
    public setContext(context: vscode.ExtensionContext): void {
        this.context = context;
    }

    /**
     * Get the current context.
     * @returns The current context.
     */
    public getContext(): vscode.ExtensionContext | undefined {
        return this.context;
    }
}
