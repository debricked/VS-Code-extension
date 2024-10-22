import { expect, sinon } from "../setup";
import { Logger } from "../../helpers/logger.helper";
import { SentryHelper } from "../../helpers/sentry.helper";
import { MessageStatus } from "../../constants/index";

describe("Logger", () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("logMessage", () => {
        it("should log message", async () => {
            const message = "log message";
            const writeLogStub = sandbox.stub(Logger, "writeLog");
            await Logger.logMessage(message);
            expect(writeLogStub.calledWith(message)).to.be.true;
        });
    });

    describe("logMessageByStatus", () => {
        it("should log message with status", async () => {
            const status = MessageStatus.INFO;
            const message = "log message";
            const writeLogStub = sandbox.stub(Logger, "writeLog");
            const captureMessageBySeverityLevelStub = sandbox.stub(SentryHelper, "captureMessageBySeverityLevel");
            await Logger.logMessageByStatus(status, message);
            expect(writeLogStub.calledWith(`[${status}] ${message}`)).to.be.true;
            expect(captureMessageBySeverityLevelStub.calledWith(status, message)).to.be.true;
        });
    });

    describe("logInfo", () => {
        it("should log info message", async () => {
            const message = "log message";
            const logMessageByStatusStub = sandbox.stub(Logger, "logMessageByStatus");
            await Logger.logInfo(message);
            expect(logMessageByStatusStub.calledWith(MessageStatus.INFO, message)).to.be.true;
        });
    });

    describe("logWarn", () => {
        it("should log warn message", async () => {
            const message = "warn message";
            const logMessageByStatusStub = sandbox.stub(Logger, "logMessageByStatus");
            await Logger.logWarn(message);
            expect(logMessageByStatusStub.calledWith(MessageStatus.WARN, message)).to.be.true;
        });
    });

    describe("logError", () => {
        it("should log error message", async () => {
            const message = "error message";
            const logMessageByStatusStub = sandbox.stub(Logger, "logMessageByStatus");
            await Logger.logError(message);
            expect(logMessageByStatusStub.calledWith(MessageStatus.ERROR, message)).to.be.true;
        });
    });

    describe("logObj", () => {
        it("should log object as warn message", async () => {
            const message = { key: "value" };
            const logMessageByStatusStub = sandbox.stub(Logger, "logMessageByStatus");
            await Logger.logObj(message);
            expect(logMessageByStatusStub.calledWith(MessageStatus.WARN, JSON.stringify(message))).to.be.true;
        });
    });

    describe("logDebug", () => {
        it("should log debug message", async () => {
            const message = { key: "value" };
            const logMessageByStatusStub = sandbox.stub(Logger, "logMessageByStatus");
            await Logger.logDebug(message);
            expect(logMessageByStatusStub.calledWith(MessageStatus.DEBUG, JSON.stringify(message))).to.be.true;
        });
    });
});
