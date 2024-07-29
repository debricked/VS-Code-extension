import axios from "axios";
import { Logger } from "./loggerHelper";
import { AuthHelper } from "./authHelper";
import { Organization } from "../constants/index";

export class ApiHelper {
    private static async getHeaders(): Promise<{ [key: string]: string }> {
        const token = await AuthHelper.getToken(true, Organization.bearer);
        if (token) {
            return {
                accept: "*/*",
                Authorization: token,
            };
        }
        return {};
    }

    public static async fetchRepositories(page: number = 1, rowsPerPage: number = 25): Promise<any> {
        const endpoint = `/api/${Organization.apiVersion}/open/repository-settings/repositories`;
        const url = `${Organization.baseUrl}${endpoint}?page=${page}&rowsPerPage=${rowsPerPage}`;

        try {
            const headers = await this.getHeaders();
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error: any) {
            Logger.logError(`Failed to fetch repositories: ${error.stack}`);
            throw error;
        }
    }
}
