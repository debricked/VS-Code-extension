import * as vscode from "vscode";
import { Logger } from ".";
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

    public getGlobalData(key: string, defaultValue?: any, attribute?: string) {
        const storedValue = this.context.globalState.get<string>(key);
        if (storedValue !== undefined) {
            try {
                const data = JSON.parse(storedValue);

                return attribute ? data[attribute] : data;
            } catch (error) {
                Logger.logMessageByStatus(MessageStatus.ERROR, `Error parsing stored value for key ${key}: ${error}`);
            }
        }
        return defaultValue;
    }

    public clearGlobalData(...keys: string[]): Thenable<void>[] {
        return keys.map((key) => this.context.globalState.update(key, undefined));
    }

    public async clearAllGlobalData(): Promise<void> {
        const allKeys = this.context.globalState.keys();
        const clearPromises = allKeys.map((key) => this.context.globalState.update(key, undefined));
        await Promise.all(clearPromises);
    }

    public setSecretData<T>(key: string, value: T): Thenable<void> {
        return this.context.secrets.store(key, JSON.stringify(value));
    }

    public async getSecretData<T>(key: string) {
        const storedValue = await this.context.secrets.get(key);
        if (storedValue !== undefined) {
            try {
                return JSON.parse(storedValue) as T;
            } catch (error) {
                Logger.logMessageByStatus(MessageStatus.ERROR, `Error parsing stored value for key ${key}: ${error}`);
            }
        }
        return storedValue;
    }

    public deleteSecretData(key: string): Thenable<void> {
        return this.context.secrets.delete(key);
    }
}
