import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Messages, Organization } from "../constants/index";
import { Common } from "../helpers";
import { DebrickedDataHelper } from "./debrickedDataHelper";

export class AuthHelper {
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
        let debrickedData: any = await Common.readDataFromDebrickedJSON();
        debrickedData = JSON.parse(debrickedData);

        if (useDefaultAccessToken) {
            accessToken = debrickedData.accessToken;
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
                // Append the access token to the existing data
                debrickedData.accessToken = accessToken;
                // Store the updated data in the token.json file
                fs.writeFileSync(Organization.debricked_data_filePath, JSON.stringify(debrickedData, null, 2));
            } else {
                throw new Error(Messages.ACCESS_TOKEN_RQD);
            }
        }

        return accessToken;
    }
}
