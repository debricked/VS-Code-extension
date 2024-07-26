import * as vscode from "vscode";

export class ShowInputBoxHelper {
    public static async promptForInput(
        options: {
            prompt: string;
            title?: string;
            placeHolder?: string;
            password?: boolean;
            ignoreFocusOut?: boolean;
            value?: string;
        },
        defaultValue?: string,
    ): Promise<string | undefined> {
        const inputBoxOptions: vscode.InputBoxOptions = {
            prompt: options.prompt,
            ignoreFocusOut: options.ignoreFocusOut ?? true,
            password: options.password ?? false,
        };

        if (options.title !== undefined) {
            inputBoxOptions.title = options.title;
        }

        if (options.placeHolder !== undefined) {
            inputBoxOptions.placeHolder = options.placeHolder;
        }

        if (options.value !== undefined) {
            inputBoxOptions.value = options.value;
        }

        const input = vscode.window.showInputBox(inputBoxOptions);
        if (input) {
            return input;
        }

        return defaultValue;
    }
}
