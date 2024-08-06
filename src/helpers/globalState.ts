import * as vscode from "vscode";

export class GlobalState {
    private static instance: GlobalState;

    private constructor(private context: vscode.ExtensionContext) {}

    public static getInstance(context: vscode.ExtensionContext): GlobalState {
        if (!GlobalState.instance) {
            GlobalState.instance = new GlobalState(context);
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
                throw new Error(`Error parsing stored value for key ${key}: ${error}`);
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
                throw new Error(`Error parsing stored value for key ${key}: ${error}`);
            }
        }
        return storedValue;
    }

    public deleteSecretData(key: string): Thenable<void> {
        return this.context.secrets.delete(key);
    }
}
