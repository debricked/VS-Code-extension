import { ApiHelper } from "./api.helper";
import { DependencyResponse, DependencyVulnerabilityWrapper, Repository, RequestParam } from "../types/index";
import { Logger } from "./logger.helper";
import { MessageStatus, SecondService } from "../constants";
import * as Sentry from "@sentry/node";

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
            Sentry.captureException(error.message || MessageStatus.UNKNOWN);
            throw error;
        }
    }

    /**
     * Fetches Dependencies Hierarchy.
     *
     * @returns {Promise<DependencyResponse>} A promise resolving to Dependencies Hierarchy.
     */
    public async fetchDependenciesHierarchy(requestParam: RequestParam): Promise<DependencyResponse> {
        this.logger.logInfo("Fetching Dependencies Hierarchy");
        try {
            return await this.apiHelper.get(requestParam);
        } catch (error: any) {
            Sentry.captureException(error.message || MessageStatus.UNKNOWN);
            throw error;
        }
    }

    /**
     * Fetches Vulnerabilities.
     *
     * @returns {Promise<DependencyVulnerabilityWrapper>} A promise resolving to Vulnerabilities.
     */
    public async fetchVulnerabilities(requestParam: RequestParam): Promise<DependencyVulnerabilityWrapper> {
        this.logger.logInfo("Fetching Vulnerabilities");
        try {
            return await this.apiHelper.get(requestParam);
        } catch (error: any) {
            Sentry.captureException(error.message || MessageStatus.UNKNOWN);
            throw error;
        }
    }
}
