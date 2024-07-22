import * as sinon from "sinon";
import * as vscode from "vscode";
import { expect } from "../setup";
import { StatusBarMessageHelper } from "../../helpers";

describe("Statusbar Message Helper: Test Suite", () => {
    let sandbox: sinon.SinonSandbox;
    let setStatusBarMessageStub: sinon.SinonStub;
    let showErrorMessageStub: sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        setStatusBarMessageStub = sandbox.stub(vscode.window, "setStatusBarMessage").returns({
            dispose: sandbox.stub(),
        } as any);
        showErrorMessageStub = sandbox.stub(vscode.window, "showErrorMessage");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should set status bar message with default timeout", () => {
        StatusBarMessageHelper.setStatusBarMessage("Test message");
        expect(setStatusBarMessageStub.calledOnceWith("Test message", 3000)).to.be.true;
    });

    it("should set status bar message with custom timeout", () => {
        StatusBarMessageHelper.setStatusBarMessage("Test message", 5000);
        expect(setStatusBarMessageStub.calledOnceWith("Test message", 5000)).to.be.true;
    });

    it("should dispose previous status bar message if exists", () => {
        const disposeStub = sandbox.stub();
        (StatusBarMessageHelper as any).statusBarMessage = { dispose: disposeStub };

        StatusBarMessageHelper.setStatusBarMessage("New message");

        expect(disposeStub.calledOnce).to.be.true;
        expect(setStatusBarMessageStub.calledOnceWith("New message", 3000)).to.be.true;
    });

    it("should show error message", () => {
        StatusBarMessageHelper.showErrorMessage("Error message");
        expect(showErrorMessageStub.calledOnceWith("Error message")).to.be.true;
    });
});
