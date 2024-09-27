export class SecondService {
    static readonly apiVersion = "1.0";
    static readonly debrickedBaseUrl = "https://debricked.com";
    static readonly baseUrl = `${SecondService.debrickedBaseUrl}/api/${SecondService.apiVersion}/`;

    static readonly dependencyUrl = "open/dependencies/get-dependencies-hierarchy";
    static readonly vulnerableUrl = "open/vulnerabilities/get-vulnerabilities";
    static readonly repositoryBaseUrl = "https://debricked.com/app/en/repository/";
    static readonly repositories = "open/repository-settings/repositories";
}
