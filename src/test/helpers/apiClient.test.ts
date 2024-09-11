import { sinon, expect } from "../setup";
import { ApiClient } from "../../helpers/apiClient";
import { AuthHelper } from "../../helpers/authHelper";
import { ErrorHandler } from "../../helpers/errorHandler";
import { Logger } from "../../helpers/loggerHelper";
import axios from "axios";

describe("ApiClient", () => {
    let apiClient: ApiClient;
    let authHelperStub: sinon.SinonStubbedInstance<AuthHelper>;
    let errorHandlerStub: sinon.SinonStubbedInstance<ErrorHandler>;
    let loggerStub: sinon.SinonStubbedInstance<typeof Logger>;
    let axiosInstance: axios.AxiosInstance;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        authHelperStub = sandbox.createStubInstance(AuthHelper);
        errorHandlerStub = sandbox.createStubInstance(ErrorHandler);
        loggerStub = {
            logInfo: sandbox.stub(),
        } as sinon.SinonStubbedInstance<typeof Logger>;
        axiosInstance = axios.create();

        apiClient = new ApiClient(authHelperStub, errorHandlerStub, loggerStub);
        apiClient.axiosInstance = axiosInstance;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("get", () => {
        it("should make a GET request with the correct URL and config", async () => {
            const url = "/test";
            const config = { headers: { Accept: "*/*" } };
            const mockResponse = { data: "test data" };

            const getStub = sinon.stub(axiosInstance, "get");
            getStub.resolves(mockResponse);

            const result = await apiClient.get(url, config);

            expect(getStub.calledOnceWith(url, config)).to.be.true;
            expect(result).to.deep.equal(mockResponse.data);
        });

        it("should make a GET request with the correct URL and config", async () => {
            const url = "/test";
            const config = { headers: { Accept: "*/*" } };
            const mockResponse = { data: "test data" };

            const getStub = sinon.stub(axiosInstance, "get").resolves(mockResponse);

            const result = await apiClient.get(url, config);

            expect(getStub.calledOnceWith(url, config)).to.be.true;
            expect(result).to.deep.equal(mockResponse.data);
        });

        it("should handle errors", async () => {
            const url = "/test";
            const expectedError = new Error("API request failed");

            sinon.stub(axiosInstance, "get").rejects(expectedError);

            await expect(apiClient.get(url)).to.be.rejectedWith(expectedError);
        });
    });

    describe("post", () => {
        it("should make a POST request with the correct URL, data, and config", async () => {
            const url = "/test";
            const data = { key: "value" };
            const config = { headers: { Accept: "*/*" } };
            const mockResponse = { data: "test data" };

            const postStub = sinon.stub(axiosInstance, "post").resolves(mockResponse);

            const result = await apiClient.post(url, data, config);

            expect(postStub.calledOnceWith(url, data, config)).to.be.true;
            expect(result).to.deep.equal(mockResponse.data);
        });

        it("should handle errors", async () => {
            const url = "/test";
            const data = { key: "value" };
            const expectedError = new Error("API request failed");

            sinon.stub(axiosInstance, "post").rejects(expectedError);

            await expect(apiClient.post(url, data)).to.be.rejectedWith(expectedError);
        });
    });
});
