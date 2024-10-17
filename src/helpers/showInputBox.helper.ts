import { InputBoxOptions } from "../types";
import * as vscode from "vscode";

export class ShowInputBoxHelper {
    public async promptForInput(options: InputBoxOptions, defaultValue?: string): Promise<string | undefined> {
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

        const input = await vscode.window.showInputBox(inputBoxOptions);

        if (input !== undefined) {
            return input;
        }

        return defaultValue;
    }
}
