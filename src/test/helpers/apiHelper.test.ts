import { ApiHelper } from "../../helpers/apiHelper";
import { ApiClient } from "../../helpers/apiClient";
import { Logger } from "../../helpers/loggerHelper";
import { SecondService } from "../../constants";
import { RequestParam } from "../../types";
import { sinon, expect } from "../setup";

describe("ApiHelper", () => {
    let apiHelper: ApiHelper;
    let apiClientStub: sinon.SinonStubbedInstance<ApiClient>;
    let loggerStub: sinon.SinonStubbedInstance<typeof Logger>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        apiClientStub = sandbox.createStubInstance(ApiClient);
        loggerStub = {
            logInfo: sandbox.stub(),
        } as sinon.SinonStubbedInstance<typeof Logger>;

        apiHelper = new ApiHelper(apiClientStub as any, loggerStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("get", () => {
        it("should make a GET request with correct URL and no parameters", async () => {
            const requestParam: RequestParam = {
                endpoint: "/test",
            };
            const expectedUrl = `${SecondService.baseUrl}/test`;
            const mockResponse = { data: "test data" };

            apiClientStub.get.resolves(mockResponse);

            const result = await apiHelper.get(requestParam);

            expect(apiClientStub.get.calledOnceWith(expectedUrl)).to.be.true;
            expect(loggerStub.logInfo.calledOnceWith(`Request URL: ${expectedUrl}`)).to.be.true;
            expect(result).to.deep.equal(mockResponse);
        });

        it("should include pagination parameters in URL if provided", async () => {
            const requestParam: RequestParam = {
                endpoint: "/test",
                page: 2,
                rowsPerPage: 10,
            };
            const expectedUrl = `${SecondService.baseUrl}/test?page=2&rowsPerPage=10`;
            const mockResponse = { data: "test data" };

            apiClientStub.get.resolves(mockResponse);

            await apiHelper.get(requestParam);

            expect(apiClientStub.get.calledOnceWith(expectedUrl)).to.be.true;
            expect(loggerStub.logInfo.calledOnceWith(`Request URL: ${expectedUrl}`)).to.be.true;
        });

        it("should include all optional parameters in URL if provided", async () => {
            const requestParam: RequestParam = {
                endpoint: "test",
                page: 1,
                rowsPerPage: 20,
                repoId: 4548,
                commitId: 5455,
                dependencyId: 8778,
            };
            const expectedUrl = `${SecondService.baseUrl}test?page=1&rowsPerPage=20&repositoryId=4548&commitId=5455&dependencyId=8778`;
            const mockResponse = { data: "test data" };

            apiClientStub.get.resolves(mockResponse);

            await apiHelper.get(requestParam);
            expect(apiClientStub.get.calledOnceWith(expectedUrl)).to.be.true;
            expect(loggerStub.logInfo.calledOnceWith(`Request URL: ${expectedUrl}`)).to.be.true;
        });

        it("should throw an error if the API request fails", async () => {
            const requestParam: RequestParam = {
                endpoint: "/test",
            };
            const expectedError = new Error("API request failed");

            apiClientStub.get.rejects(expectedError);

            await expect(apiHelper.get(requestParam)).to.be.rejectedWith(expectedError);
        });
    });
});
