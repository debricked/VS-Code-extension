import { activate, deactivate } from "../extension";
import * as vscode from "vscode";
import { expect, sinon } from "./setup";

describe("Extension: Test Suite", () => {
    let context: vscode.ExtensionContext;
    let activateFn: sinon.SinonSpy;
    let deactivateFn: sinon.SinonSpy;

    before(async () => {
        activateFn = sinon.spy(activate);
        deactivateFn = sinon.spy(deactivate);
    });

    after(() => {
        activateFn.resetHistory();
        deactivateFn.resetHistory();
    });

    vscode.window.showInformationMessage("Debricked: Unit tests started");

    it("should activate the extension without errors", () => {
        activateFn(context);
        expect(activateFn.calledOnce).to.be.true;
        expect(activateFn).to.be.a("function");
    });

    it("should deactivate the extension without errors", () => {
        expect(deactivate).to.not.throw();
        expect(deactivateFn).to.be.a("function");
    });
});
