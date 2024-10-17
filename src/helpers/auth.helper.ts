import { Messages, Secrets } from "../constants/index";
import { ShowInputBoxHelper } from "./showInputBox.helper";
import { StatusBarMessageHelper } from "./statusBarMessage.helper";
import { Logger } from "./logger.helper";
import { GlobalStore } from "./globalStore";

export class AuthHelper {
    constructor(
        private showInputBoxHelper: ShowInputBoxHelper,
        private statusBarMessageHelper: StatusBarMessageHelper,
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
                // Prompt the user to enter the access token
                this.logger.logInfo("InputBox Opened for tokens");

                token = await this.showInputBoxHelper.promptForInput({
                    prompt: tokenKey === Secrets.ACCESS ? Messages.ENTER_ACCESS_TOKEN : Messages.ENTER_BEARER_TOKEN,
                    ignoreFocusOut: true,
                    password: true,
                    title: tokenKey === Secrets.ACCESS ? Messages.ACCESS_TOKEN : Messages.BEARER_TOKEN,
                    placeHolder:
                        tokenKey === Secrets.ACCESS ? Messages.ENTER_ACCESS_TOKEN : Messages.ENTER_BEARER_TOKEN,
                });

                this.setToken(tokenKey, token);
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
            const message = tokenKey === Secrets.ACCESS ? Messages.ACCESS_TOKEN_SAVED : Messages.BEARER_TOKEN_SAVED;
            this.statusBarMessageHelper.showInformationMessage(message);
        } else {
            const message = tokenKey === Secrets.ACCESS ? Messages.ACCESS_TOKEN_RQD : Messages.BEARER_TOKEN_RQD;
            throw new Error(message);
        }
    }
}
