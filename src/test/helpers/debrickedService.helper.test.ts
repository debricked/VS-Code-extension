import { sinon, expect } from "../setup";
import { DebrickedServiceHelper } from "../../helpers/debrickedService.helper";
import { ApiHelper } from "../../helpers/api.helper";
import { Logger } from "../../helpers/logger.helper";
import { SentryHelper } from "../../helpers/sentry.helper";
import * as Sentry from "@sentry/node";

describe("DebrickedServiceHelper", () => {
    let debrickedServiceHelper: DebrickedServiceHelper;
    let apiHelperStub: sinon.SinonStubbedInstance<ApiHelper>;
    let loggerStub: sinon.SinonStubbedInstance<typeof Logger>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        apiHelperStub = sandbox.createStubInstance(ApiHelper);
        loggerStub = {
            logInfo: sandbox.stub(),
        } as sinon.SinonStubbedInstance<typeof Logger>;

        debrickedServiceHelper = new DebrickedServiceHelper(apiHelperStub, loggerStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("fetchRepositories", () => {
        it("should fetch repositories successfully", async () => {
            const mockResponse = { repositories: ["Repository 1", "Repository 2"] };
            apiHelperStub.get.resolves(mockResponse);

            const result = await debrickedServiceHelper.fetchRepositories();
            expect(result).to.deep.equal(mockResponse.repositories);
            expect(apiHelperStub.get.calledOnce).to.be.true;
            expect(loggerStub.logInfo.calledOnce).to.be.true;
        });

        it("should handle errors", async () => {
            const expectedError = new Error("API request failed");
            apiHelperStub.get.rejects(expectedError);

            await expect(debrickedServiceHelper.fetchRepositories()).to.be.rejectedWith(expectedError);
            const captureExceptionStub = sandbox.stub(Sentry, "captureException");
            const error = new Error("Test error");

            SentryHelper.captureException(error);

            expect(captureExceptionStub.calledOnceWith(error)).to.be.true;
        });
    });

    describe("fetchDependenciesHierarchy", () => {
        it("should fetch dependencies hierarchy successfully", async () => {
            const requestParam = { endpoint: "dependencies/hierarchy" };
            const mockResponse = { dependencies: ["Dependency 1", "Dependency 2"] };
            apiHelperStub.get.resolves(mockResponse);

            const result = await debrickedServiceHelper.fetchDependenciesHierarchy(requestParam);
            expect(result).to.deep.equal(mockResponse);
            expect(apiHelperStub.get.calledOnce).to.be.true;
            expect(loggerStub.logInfo.calledOnce).to.be.true;
        });

        it("should handle errors", async () => {
            const requestParam = { endpoint: "dependencies/hierarchy" };
            const expectedError = new Error("API request failed");
            apiHelperStub.get.rejects(expectedError);

            await expect(debrickedServiceHelper.fetchDependenciesHierarchy(requestParam)).to.be.rejectedWith(
                expectedError,
            );
            const captureExceptionStub = sandbox.stub(Sentry, "captureException");
            const error = new Error("Test error");

            SentryHelper.captureException(error);

            expect(captureExceptionStub.calledOnceWith(error)).to.be.true;
        });
    });

    describe("fetchVulnerabilities", () => {
        it("should fetch vulnerabilities successfully", async () => {
            const requestParam = { endpoint: "vulnerabilities" };
            const mockResponse = { vulnerabilities: ["Vulnerability 1", "Vulnerability 2"] };
            apiHelperStub.get.resolves(mockResponse);

            const result = await debrickedServiceHelper.fetchVulnerabilities(requestParam);
            expect(result).to.deep.equal(mockResponse);
            expect(apiHelperStub.get.calledOnce).to.be.true;
            expect(loggerStub.logInfo.calledOnce).to.be.true;
        });

        it("should handle errors", async () => {
            const requestParam = { endpoint: "vulnerabilities" };
            const expectedError = new Error("API request failed");
            apiHelperStub.get.rejects(expectedError);

            await expect(debrickedServiceHelper.fetchVulnerabilities(requestParam)).to.be.rejectedWith(expectedError);
            const captureExceptionStub = sandbox.stub(Sentry, "captureException");
            const error = new Error("Test error");

            SentryHelper.captureException(error);

            expect(captureExceptionStub.calledOnceWith(error)).to.be.true;
        });
    });
});
