import * as vscode from "vscode";
import { Messages, Organization } from "../constants/index";
import { GlobalState, Logger, ShowInputBoxHelper } from "../helpers";

export class AuthHelper {
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }
    /**
     * Get access token
     * @param void
     * @returns Promise<string | undefined>
     */
    static async getToken(useDefaultToken: boolean = true, tokenKey: "access" | "bearer"): Promise<string | undefined> {
        try {
            let token: string | undefined;
            const TOKEN_KEY = tokenKey === "access" ? Organization.ACCESS_TOKEN_KEY : Organization.BEARER_TOKEN_KEY;
            const defaultAccessToken: any = await AuthHelper.globalState.getSecretData(TOKEN_KEY);

            if (useDefaultToken) {
                token = defaultAccessToken;
            }

            if (!token) {
                // Prompt the user to enter the access token
                Logger.logInfo("InputBox Opened for tokens");

                token = await ShowInputBoxHelper.promptForInput({
                    prompt: tokenKey === "access" ? Messages.ENTER_ACCESS_TOKEN : Messages.ENTER_BEARER_TOKEN,
                    ignoreFocusOut: true,
                    password: true,
                    title: tokenKey === "access" ? Messages.ACCESS_TOKEN : Messages.BEARER_TOKEN,
                    placeHolder: tokenKey === "access" ? Messages.ENTER_ACCESS_TOKEN : Messages.ENTER_BEARER_TOKEN,
                });

                if (token) {
                    await AuthHelper.globalState.setSecretData(TOKEN_KEY, token);
                    const message = tokenKey === "access" ? Messages.ACCESS_TOKEN_SAVED : Messages.BEARER_TOKEN_SAVED;
                    vscode.window.showInformationMessage(message);
                } else {
                    const message = tokenKey === "access" ? Messages.ACCESS_TOKEN_RQD : Messages.BEARER_TOKEN_RQD;
                    throw new Error(message);
                }
            }

            return token;
        } catch (error: any) {
            await vscode.window.showErrorMessage(error.message);
            Logger.logError("Token input was empty or some other error occurred");
            return undefined;
        }
    }
}
