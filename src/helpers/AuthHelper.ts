import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Messages, Organization } from "../constants/index";
import { Common } from "../helpers";

export class AuthHelper {
    /**
     * Get access token
     * @param void
     * @returns Promise<string | undefined>
     */
    static async getAccessToken(): Promise<string | undefined> {
        const debrickedFolder = path.join(Organization.debricked_installed_dir, Organization.debrickedFolder);
        Common.createDirectory(debrickedFolder);

        // Try to read the access token from the token.json file
        let accessToken: string | undefined;
        let tokenData: any = {};
        if (fs.existsSync(Organization.debricked_data_filePath)) {
            const tokenFileContent = fs.readFileSync(Organization.debricked_data_filePath, "utf-8");
            tokenData = JSON.parse(tokenFileContent);
            accessToken = tokenData.accessToken;
        }

        if (!accessToken) {
            // Prompt the user to enter the access token
            accessToken = await vscode.window.showInputBox({
                prompt: Messages.ENTER_ACCESS_TOKEN,
                ignoreFocusOut: true,
                password: true, // To hide the input characters
            });

            if (accessToken) {
                // Append the access token to the existing data
                tokenData.accessToken = accessToken;
                // Store the updated data in the token.json file
                fs.writeFileSync(Organization.debricked_data_filePath, JSON.stringify(tokenData, null, 2));
            } else {
                throw new Error(Messages.ACCESS_TOKEN_RQD);
            }
        }

        return accessToken;
    }
}
