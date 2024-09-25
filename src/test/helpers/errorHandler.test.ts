import { ErrorHandler } from "../../helpers/errorHandler";
import { Logger } from "../../helpers/loggerHelper";
import { StatusBarMessageHelper } from "../../helpers/statusBarMessageHelper";
import { SentryHelper } from "../../helpers/sentryHelper";
import { expect, sinon } from "../setup";

describe("ErrorHandler", () => {
    let errorHandler: ErrorHandler;
    let loggerStub: sinon.SinonStubbedInstance<typeof Logger>;
    let statusBarMessageHelperStub: sinon.SinonStubbedInstance<StatusBarMessageHelper>;
    let sentryHelperStub: sinon.SinonStubbedInstance<typeof SentryHelper>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        loggerStub = {
            logError: sandbox.stub(),
            logException: sandbox.stub(),
        } as any;
        statusBarMessageHelperStub = {
            showErrorMessage: sandbox.stub(),
        } as any;
        sentryHelperStub = {
            captureException: sandbox.stub(),
        } as any;

        errorHandler = new ErrorHandler(statusBarMessageHelperStub, loggerStub, sentryHelperStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("handleError", () => {
        it("should log and show an error message for an Error object", () => {
            const error = new Error("Test error");

            errorHandler.handleError(error);

            expect(loggerStub.logError.calledOnceWith(`Error: ${error.message}`)).to.be.true;
            expect(loggerStub.logException.calledOnceWith(error.stack)).to.be.true;
            expect(statusBarMessageHelperStub.showErrorMessage.calledOnceWith(`${error.message}`)).to.be.true;
        });

        it("should log and show an error message for a string error", () => {
            const error = "Test string error";

            errorHandler.handleError(error);

            expect(loggerStub.logError.calledOnceWith(`Error: ${error}`)).to.be.true;
            expect(loggerStub.logException.called).to.be.false;
            expect(statusBarMessageHelperStub.showErrorMessage.calledOnceWith(`${error}`)).to.be.true;
        });

        it("should log and show a default error message for an unknown error type", () => {
            const error = { unexpected: "error" };

            errorHandler.handleError(error);

            expect(loggerStub.logError.calledOnceWith("Error: An unknown error occurred")).to.be.true;
            expect(loggerStub.logException.called).to.be.false;
            expect(statusBarMessageHelperStub.showErrorMessage.calledOnceWith("An unknown error occurred")).to.be.true;
        });
    });

    describe("setupGlobalErrorHandlers", () => {
        it("should handle uncaught exceptions", () => {
            const processOnStub = sandbox.stub(process, "on");

            errorHandler.setupGlobalErrorHandlers();
            expect(processOnStub.calledWith("uncaughtException", sinon.match.func)).to.be.true;

            const uncaughtExceptionHandler = processOnStub.getCall(0).args[1];
            const error = new Error("Uncaught exception");

            uncaughtExceptionHandler(error);
            // expect(loggerStub.logError.calledOnceWith(`Uncaught Exception: ${error}`)).to.be.true;

            expect(loggerStub.logException.calledOnceWith(error.stack)).to.be.true;
            expect(statusBarMessageHelperStub.showErrorMessage.calledOnceWith(`${error.message}`)).to.be.true;
        });

        it("should handle unhandled rejections", () => {
            const processOnStub = sandbox.stub(process, "on");

            errorHandler.setupGlobalErrorHandlers();

            expect(processOnStub.calledWith("unhandledRejection", sinon.match.func)).to.be.true;
            const unhandledRejectionHandler = processOnStub.getCall(1).args[1];
            const reason = "Unhandled rejection reason";
            const promise = Promise.resolve();

            unhandledRejectionHandler(reason, promise);
            expect(statusBarMessageHelperStub.showErrorMessage.calledOnce).to.be.true;
        });
    });
});
