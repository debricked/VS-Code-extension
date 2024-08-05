import { ApiClient } from "./apiClient";
import { RequestParam } from "../types";
import { Logger } from "./loggerHelper";
import { Organization } from "../constants/index";

export class ApiHelper {
    constructor(
        private apiClient: ApiClient,
        private logger: typeof Logger,
    ) {}

    public async get(requestParam: RequestParam): Promise<any> {
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
            this.logger.logInfo(`Request URL: ${url}`);
            const response = await this.apiClient.get<any>(url);
            return response;
        } catch (error: any) {
            throw error;
        }
    }
}
