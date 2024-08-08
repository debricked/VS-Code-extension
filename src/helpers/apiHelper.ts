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
        let url = `${Organization.baseUrl}${requestParam.endpoint}`;

        const params = [];
        if (requestParam.page) {
            params.push(`page=${requestParam.page}`);
        }
        if (requestParam.rowsPerPage) {
            params.push(`rowsPerPage=${requestParam.rowsPerPage}`);
        }

        if (requestParam.repoId) {
            params.push(`repositoryId=${requestParam.repoId}`);
        }

        if (requestParam.commitId) {
            params.push(`commitId=${requestParam.commitId}`);
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
