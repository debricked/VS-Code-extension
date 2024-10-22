import { Messages, Secrets } from "../constants/index";
import { ShowInputBoxHelper } from "./showInputBox.helper";
import { Logger } from "./logger.helper";
import { GlobalStore } from "./globalStore";
import { authService } from "../services";
import { AuthToken } from "../types";

export class AuthHelper {
    constructor(
        private showInputBoxHelper: ShowInputBoxHelper,
        private logger: typeof Logger,
        private globalStore: GlobalStore,
    ) {}

    /**
     * Get access token
     * @param void
     * @returns Promise<string | undefined>
     */
    async getToken(useDefaultToken = true, tokenKey: Secrets): Promise<string | undefined> {
        try {
            let token: string | undefined;
            const defaultToken: any = await this.globalStore.getGlobalStateInstance()?.getSecretData(tokenKey);

            if (useDefaultToken) {
                token = defaultToken;
            }

            if (!token) {
                if (tokenKey === Secrets.ACCESS) {
                    // Prompt the user to enter the access token
                    this.logger.logInfo("InputBox Opened for tokens");

                    token = await this.showInputBoxHelper.promptForInput({
                        prompt: tokenKey === Secrets.ACCESS ? Messages.ENTER_ACCESS_TOKEN : Messages.AUTH_RQD,
                        ignoreFocusOut: true,
                        password: true,
                        title: tokenKey === Secrets.ACCESS ? Messages.ACCESS_TOKEN : Messages.AUTH_RQD,
                        placeHolder: tokenKey === Secrets.ACCESS ? Messages.ENTER_ACCESS_TOKEN : Messages.AUTH_RQD,
                    });
                } else if (tokenKey === Secrets.BEARER) {
                    const newToken: AuthToken = authService.extractToken(await authService.fetchToken());
                    token = newToken.access_token;
                }

                await this.setToken(tokenKey, token);
            }

            return token;
        } catch (error) {
            this.logger.logError("Error in getToken");
            throw error;
        }
    }

    async setToken(tokenKey: Secrets, token: string | undefined): Promise<void> {
        if (token) {
            await this.globalStore.getGlobalStateInstance()?.setSecretData(tokenKey, token);
        } else {
            throw new Error(Messages.AUTH_RQD);
        }
    }
}
