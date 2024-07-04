import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MESSAGE, ORGANIZATION } from '@constants';

class AuthHelper {

    /**
     * Get access token
     * @param void
     * @returns Promise<string | undefined>
     */
    static async getAccessToken(): Promise<string | undefined> {
        if (!ORGANIZATION.workspace) {
            throw new Error(MESSAGE.WS_NOT_FOND);
        }

        const debrickedFolder = path.join(ORGANIZATION.workspace, ORGANIZATION.name);
        const tokenFilePath = path.join(debrickedFolder, ORGANIZATION.access_token_file);

        // Ensure the debricked folder exists
        if (!fs.existsSync(debrickedFolder)) {
            fs.mkdirSync(debrickedFolder);
        }

        // Try to read the access token from the token.json file
        let accessToken: string | undefined;
        if (fs.existsSync(tokenFilePath)) {
            const tokenFileContent = fs.readFileSync(tokenFilePath, 'utf-8');
            const tokenData = JSON.parse(tokenFileContent);
            accessToken = tokenData.accessToken;
        }

        if (!accessToken) {
            // Prompt the user to enter the access token
            accessToken = await vscode.window.showInputBox({
                prompt: MESSAGE.ENTER_ACCESS_TOKEN,
                ignoreFocusOut: true,
                password: true // To hide the input characters
            });

            if (accessToken) {
                // Store the access token in the token.json file
                fs.writeFileSync(tokenFilePath, JSON.stringify({ accessToken }, null, 2));
            } else {
                throw new Error(MESSAGE.ACCESS_TOKEN_RQD);
            }
        }

        return accessToken;
    }

}

export default AuthHelper;