import * as Sentry from "@sentry/node";
import { SentryHelper } from "../../helpers";
import { MessageStatus, Environment } from "../../constants";
import { expect, sinon } from "../setup";

describe("SentryHelper", () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should initialize Sentry with the provided configuration", () => {
        const initStub = sandbox.stub(Sentry, "init");
        SentryHelper.initialize("dsn", "release", Environment.PROD, 1.0);

        expect(initStub.calledOnce).to.be.true;
    });

    it("should capture an exception and send it to Sentry", () => {
        const captureExceptionStub = sandbox.stub(Sentry, "captureException");
        const error = new Error("Test error");

        SentryHelper.captureException(error);

        expect(captureExceptionStub.calledOnceWith(error)).to.be.true;
    });

    it("should capture a custom message and send it to Sentry", () => {
        const captureMessageStub = sandbox.stub(Sentry, "captureMessage");
        const message = "Test message";

        SentryHelper.captureMessage(message);

        expect(captureMessageStub.calledOnceWith(message, "info")).to.be.true;
    });

    it("should capture a custom event and send it to Sentry", () => {
        const captureEventStub = sandbox.stub(Sentry, "captureEvent");
        const event = { message: "Test event" } as Sentry.Event;

        SentryHelper.captureEvent(event);

        expect(captureEventStub.calledOnceWith(event)).to.be.true;
    });

    it("should add a breadcrumb to Sentry", () => {
        const addBreadcrumbStub = sandbox.stub(Sentry, "addBreadcrumb");
        const message = "Test breadcrumb";
        const category = "test";
        const level = "info";

        SentryHelper.addBreadcrumb(message, category, level);

        expect(
            addBreadcrumbStub.calledOnceWith({
                message,
                category,
                level,
                data: {},
            }),
        ).to.be.true;
    });

    it("should set a tag in Sentry's context", () => {
        const setTagStub = sandbox.stub(Sentry, "setTag");
        const key = "testKey";
        const value = "testValue";

        SentryHelper.setTag(key, value);

        expect(setTagStub.calledOnceWith(key, value)).to.be.true;
    });

    it("should set user context in Sentry", () => {
        const setUserStub = sandbox.stub(Sentry, "setUser");
        const user = { id: "testUser" } as Sentry.User;

        SentryHelper.setUser(user);

        expect(setUserStub.calledOnceWith(user)).to.be.true;
    });

    it("should set extra context data in Sentry", () => {
        const setExtraStub = sandbox.stub(Sentry, "setExtra");
        const key = "testKey";
        const value = "testValue";

        SentryHelper.setExtra(key, value);

        expect(setExtraStub.calledOnceWith(key, value)).to.be.true;
    });

    it("should close the Sentry client gracefully", async () => {
        const closeStub = sandbox.stub(Sentry, "close").resolves();

        await SentryHelper.close();

        expect(closeStub.calledOnce).to.be.true;
    });

    it("should capture a message by severity level", () => {
        const captureExceptionStub = sandbox.stub(SentryHelper, "captureException");
        const captureMessageStub = sandbox.stub(SentryHelper, "captureMessage");
        const errorMsg = new Error("exception");

        SentryHelper.captureMessageBySeverityLevel(MessageStatus.EXCEPTION, errorMsg);
        expect(captureExceptionStub.calledOnceWith(errorMsg)).to.be.true;

        SentryHelper.captureMessageBySeverityLevel(MessageStatus.ERROR, "error msg");
        expect(captureMessageStub.calledOnceWith("error msg", "error")).to.be.true;
    });
});
