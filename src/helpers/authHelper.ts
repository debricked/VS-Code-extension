import { Messages, Organization } from "../constants/index";
import { GlobalState, Logger, StatusBarMessageHelper } from ".";
import { ShowInputBoxHelper } from "./showInputBoxHelper";

export class AuthHelper {
    private static get globalState(): GlobalState {
        return GlobalState.getInstance();
    }
    /**
     * Get access token
     * @param void
     * @returns Promise<string | undefined>
     */
    async getToken(useDefaultToken: boolean = true, tokenKey: "access" | "bearer"): Promise<string | undefined> {
        try {
            let token: string | undefined;
            const TOKEN_KEY =
                tokenKey === Organization.access ? Organization.accessTokenKey : Organization.bearerTokenKey;
            const defaultAccessToken: any = await AuthHelper.globalState.getSecretData(TOKEN_KEY);

            if (useDefaultToken) {
                token = defaultAccessToken;
            }

            if (!token) {
                // Prompt the user to enter the access token
                Logger.logInfo("InputBox Opened for tokens");
                const showInputBoxHelper = new ShowInputBoxHelper();

                token = await showInputBoxHelper.promptForInput({
                    prompt:
                        tokenKey === Organization.access ? Messages.ENTER_ACCESS_TOKEN : Messages.ENTER_BEARER_TOKEN,
                    ignoreFocusOut: true,
                    password: true,
                    title: tokenKey === Organization.access ? Messages.ACCESS_TOKEN : Messages.BEARER_TOKEN,
                    placeHolder:
                        tokenKey === Organization.access ? Messages.ENTER_ACCESS_TOKEN : Messages.ENTER_BEARER_TOKEN,
                });

                if (token) {
                    await AuthHelper.globalState.setSecretData(TOKEN_KEY, token);
                    const message =
                        tokenKey === Organization.access ? Messages.ACCESS_TOKEN_SAVED : Messages.BEARER_TOKEN_SAVED;
                    StatusBarMessageHelper.showInformationMessage(message);
                } else {
                    const message =
                        tokenKey === Organization.access ? Messages.ACCESS_TOKEN_RQD : Messages.BEARER_TOKEN_RQD;
                    throw new Error(message);
                }
            }

            return token;
        } catch (error: any) {
            throw error;
        }
    }
}
