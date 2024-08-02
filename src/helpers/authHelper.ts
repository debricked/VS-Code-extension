import { Messages, Organization } from "../constants/index";
import { ShowInputBoxHelper } from "./showInputBoxHelper";
import { StatusBarMessageHelper } from "./statusBarMessageHelper";
import { Logger } from "./loggerHelper";
import { GlobalState } from "./globalState";

export class AuthHelper {
    constructor(
        private showInputBoxHelper: ShowInputBoxHelper,
        private statusBarMessageHelper: StatusBarMessageHelper,
        private logger: typeof Logger,
        private globalState: typeof GlobalState,
    ) {}

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
            const defaultAccessToken: any = await this.globalState.getInstance().getSecretData(TOKEN_KEY);

            if (useDefaultToken) {
                token = defaultAccessToken;
            }

            if (!token) {
                // Prompt the user to enter the access token
                this.logger.logInfo("InputBox Opened for tokens");

                token = await this.showInputBoxHelper.promptForInput({
                    prompt:
                        tokenKey === Organization.access ? Messages.ENTER_ACCESS_TOKEN : Messages.ENTER_BEARER_TOKEN,
                    ignoreFocusOut: true,
                    password: true,
                    title: tokenKey === Organization.access ? Messages.ACCESS_TOKEN : Messages.BEARER_TOKEN,
                    placeHolder:
                        tokenKey === Organization.access ? Messages.ENTER_ACCESS_TOKEN : Messages.ENTER_BEARER_TOKEN,
                });

                if (token) {
                    await this.globalState.getInstance().setSecretData(TOKEN_KEY, token);
                    const message =
                        tokenKey === Organization.access ? Messages.ACCESS_TOKEN_SAVED : Messages.BEARER_TOKEN_SAVED;
                    this.statusBarMessageHelper.showInformationMessage(message);
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
