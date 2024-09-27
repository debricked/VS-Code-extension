import { ApiHelper } from "./apiHelper";
import { Repository, RequestParam } from "../types/index";
import { Logger } from "./loggerHelper";
import { SecondService } from "../constants";
import { SentryHelper } from "./sentryHelper";

export class DebrickedServiceHelper {
    private readonly apiHelper: ApiHelper;
    private readonly logger: typeof Logger;

    constructor(apiHelper: ApiHelper, logger: typeof Logger) {
        this.apiHelper = apiHelper;
        this.logger = logger;
    }

    /**
     * Fetches a list of repositories.
     *
     * @returns {Promise<Repository[]>} A promise resolving to an array of repositories.
     */
    public async fetchRepositories(): Promise<Repository[]> {
        this.logger.logInfo("Fetching repositories");
        const requestParam: RequestParam = {
            endpoint: SecondService.repositories,
        };
        try {
            const response = await this.apiHelper.get(requestParam);
            return response.repositories || [];
        } catch (error: any) {
            SentryHelper.captureException(error);
            throw error;
        }
    }
}
