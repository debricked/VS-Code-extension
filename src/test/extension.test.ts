import { activate, deactivate } from "../extension";
import * as vscode from "vscode";
import sinon from "sinon";

describe("Extension : Test Suite", () => {
    let expect: any;
    let context: vscode.ExtensionContext;

    before(async () => {
        const chai = await import("chai");
        chai.should();
        expect = chai.expect;

        context = {
            subscriptions: [],
        } as any;
    });

    afterEach(() => {});

    vscode.window.showInformationMessage("Start all tests.");

    it("activate : should run", () => {
        let activateFn = sinon.spy(activate);
        activateFn(context);
        expect(activateFn).to.be.a("function");
    });

    it("deactivate : should not throw any errors", () => {
        expect(deactivate).to.not.throw();
        expect(deactivate).to.be.a("function");
    });
});
