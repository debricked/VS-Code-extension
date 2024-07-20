import * as vscode from "vscode";

export class ShowInputBoxHelper {
    public static async inputData(placeholder: string, defaultValue: string): Promise<string> {
        let data = await vscode.window.showInputBox({
            prompt: placeholder,
            ignoreFocusOut: false,
        });

        if (!data) {
            data = defaultValue;
        }

        return data;
    }
}
