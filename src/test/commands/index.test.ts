import * as vscode from "vscode";
import sinon from "sinon";
import { registerCommands } from "../../commands";

describe("Register Commands : Test Suite", () => {
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

    it("Register Commands", () => {
        let registerCommand = sinon.spy(registerCommands);
        registerCommand(context);
        expect(registerCommand).to.be.a("function");
    });
});
