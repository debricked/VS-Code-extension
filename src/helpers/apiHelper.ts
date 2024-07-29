import axios from "axios";
import { AuthHelper } from "./authHelper";
import { Organization } from "../constants/index";
import { RequestParam } from "../types";
import { ErrorHandler } from "./errorHandler";
import { Logger } from "./loggerHelper";

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

    public static async fetch(requestParam: RequestParam): Promise<any> {
        const { endpoint, page, rowsPerPage } = requestParam;
        let url = `${Organization.baseUrl}${endpoint}`;

        const params = [];
        if (page) {
            params.push(`page=${page}`);
        }
        if (rowsPerPage) {
            params.push(`rowsPerPage=${rowsPerPage}`);
        }

        if (params.length > 0) {
            url += `?${params.join("&")}`;
        }

        try {
            Logger.logInfo(`request URL: ${url}`);
            const headers = await this.getHeaders();
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error: any) {
            ErrorHandler.handleError(error);
            throw error;
        }
    }
}
