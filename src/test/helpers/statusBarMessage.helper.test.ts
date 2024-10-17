import * as vscode from "vscode";
import { StatusBarMessageHelper } from "../../helpers/statusBarMessage.helper";
import { Organization } from "../../constants";
import { expect, sinon } from "../setup";

describe("StatusBarMessageHelper", () => {
    let statusBarMessageHelper: StatusBarMessageHelper;
    let windowStub: sinon.SinonStubbedInstance<typeof vscode.window>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        windowStub = sandbox.stub(vscode.window);
        statusBarMessageHelper = new StatusBarMessageHelper();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("setStatusBarMessage", () => {
        it("should set a status bar message", () => {
            const message = "Test message";
            const disposeMock = { dispose: sinon.stub() };
            windowStub.setStatusBarMessage.returns(disposeMock as any);

            statusBarMessageHelper.setStatusBarMessage(message);

            expect(windowStub.setStatusBarMessage.calledOnce).to.be.true;
            expect(windowStub.setStatusBarMessage.firstCall.args[0]).to.equal(message);
        });

        it("should dispose previous status bar message before setting a new one", () => {
            const message1 = "Test message 1";
            const message2 = "Test message 2";
            const disposeMock1 = { dispose: sinon.stub() };
            const disposeMock2 = { dispose: sinon.stub() };
            windowStub.setStatusBarMessage.onFirstCall().returns(disposeMock1 as any);
            windowStub.setStatusBarMessage.onSecondCall().returns(disposeMock2 as any);

            statusBarMessageHelper.setStatusBarMessage(message1);
            statusBarMessageHelper.setStatusBarMessage(message2);

            expect(disposeMock1.dispose.calledOnce).to.be.true;
            expect(windowStub.setStatusBarMessage.calledTwice).to.be.true;
        });
    });

    describe("showErrorMessage", () => {
        it("should show an error message with organization prefix", () => {
            const message = "Test error";
            statusBarMessageHelper.showErrorMessage(message);

            expect(windowStub.showErrorMessage.calledOnce).to.be.true;
            expect(windowStub.showErrorMessage.firstCall.args[0]).to.equal(`${Organization.nameCaps}: ${message}`);
        });
    });

    describe("showInformationMessage", () => {
        it("should show an information message with organization prefix", () => {
            const message = "Test info";
            statusBarMessageHelper.showInformationMessage(message);

            expect(windowStub.showInformationMessage.calledOnce).to.be.true;
            expect(windowStub.showInformationMessage.firstCall.args[0]).to.equal(
                `${Organization.nameCaps}: ${message}`,
            );
        });
    });
});
