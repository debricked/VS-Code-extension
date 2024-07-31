import { RequestParam } from "../types";
import { ApiClient, Logger } from ".";
import { Organization } from "../constants/index";

export class ApiHelper {
    public static async get(requestParam: RequestParam): Promise<any> {
        const apiClient = new ApiClient();

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
            Logger.logInfo(`Request URL: ${url}`);
            const response = await apiClient.get<any>(url);
            return response;
        } catch (error: any) {
            throw error;
        }
    }
}
