import * as vscode from "vscode";
import * as path from "path";
import { Messages, Organization } from "../constants/index";
import { GlobalState } from "../helpers";
import { DebrickedDataHelper } from "./debrickedDataHelper";

export class AuthHelper {
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }
    /**
     * Get access token
     * @param void
     * @returns Promise<string | undefined>
     */
    static async getAccessToken(useDefaultAccessToken: boolean = true): Promise<string | undefined> {
        const debrickedFolder = path.join(Organization.debricked_installed_dir, Organization.debrickedFolder);
        DebrickedDataHelper.createDir(debrickedFolder);

        // Try to read the access token from the token.json file
        let accessToken: string | undefined;
        const defaultAccessToken: any = await AuthHelper.globalState.getSecretData(Organization.ACCESS_TOKEN_KEY);

        if (useDefaultAccessToken) {
            accessToken = defaultAccessToken;
        }

        if (!accessToken) {
            // Prompt the user to enter the access token
            accessToken = await vscode.window.showInputBox({
                prompt: Messages.ENTER_ACCESS_TOKEN,
                ignoreFocusOut: true,
                password: true, // To hide the input characters
                title: Messages.ACCESS_TOKEN,
                placeHolder: Messages.ENTER_ACCESS_TOKEN,
            });

            if (accessToken) {
                await AuthHelper.globalState.setSecretData(Organization.ACCESS_TOKEN_KEY, accessToken);
            } else {
                throw new Error(Messages.ACCESS_TOKEN_RQD);
            }
        }

        return accessToken;
    }
}
