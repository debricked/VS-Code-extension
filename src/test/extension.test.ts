// test/commands.test.ts
import { deactivate } from "../extension";
import { registerCommands } from "../commands";
import * as vscode from "vscode";

describe("Extension : Test Suite", () => {
    let expect: any;

    before(async () => {
        const chai = await import("chai");
        chai.should();
        expect = chai.expect;
    });

    vscode.window.showInformationMessage("Start all tests.");

    describe("Activate : Commands Test Suite", () => {
        it("Register Commands", () => {
            const context: vscode.ExtensionContext = {
                subscriptions: [],
            } as any;

            registerCommands(context);
        });
    });

    describe("Deactivate : Commands Test Suite", () => {
        it("should not throw any errors", () => {
            expect(deactivate).to.not.throw();
            expect(deactivate).to.be.a("function");
        });
    });
});
