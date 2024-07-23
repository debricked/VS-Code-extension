import * as vscode from "vscode";
import { Logger } from "./loggerHelper";
import { MessageStatus } from "../constants";

export class GlobalState {
    private static instance: GlobalState;

    private constructor(private context: vscode.ExtensionContext) {}

    public static initialize(context: vscode.ExtensionContext): GlobalState {
        if (!GlobalState.instance) {
            GlobalState.instance = new GlobalState(context);
        }
        return GlobalState.instance;
    }

    public static getInstance(): GlobalState {
        if (!GlobalState.instance) {
            throw new Error("GlobalState not initialized. Call initialize() first.");
        }
        return GlobalState.instance;
    }

    public setGlobalData<T>(key: string, data: T): Thenable<void> {
        return this.context.globalState.update(key, JSON.stringify(data));
    }

    public getGlobalData<T>(key: string, defaultValue?: T): T | undefined {
        const storedValue = this.context.globalState.get<string>(key);
        if (storedValue !== undefined) {
            try {
                return JSON.parse(storedValue) as T;
            } catch (error) {
                Logger.logMessageByStatus(MessageStatus.ERROR, `Error parsing stored value for key ${key}: ${error}`);
            }
        }
        return defaultValue;
    }

    public getGlobalDataByKey(globalKey: string, key: string) {
        const storedValue = this.context.globalState.get<string>(globalKey);
        if (storedValue !== undefined) {
            try {
                const data = JSON.parse(storedValue);
                return data[key];
            } catch (error) {
                Logger.logMessageByStatus(MessageStatus.ERROR, `Error parsing stored value for key ${key}: ${error}`);
            }
        }
        return storedValue;
    }

    public clearGlobalData(...keys: string[]): Thenable<void>[] {
        return keys.map((key) => this.context.globalState.update(key, undefined));
    }

    public async clearAllGlobalData(): Promise<void> {
        const allKeys = this.context.globalState.keys();
        const clearPromises = allKeys.map((key) => this.context.globalState.update(key, undefined));
        await Promise.all(clearPromises);
    }
}
