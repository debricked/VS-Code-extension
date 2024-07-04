// test/commands.test.ts
import * as vscode from "vscode";

describe("Extension : Commands Test Suite", () => {
    before(async () => {
        const chai = await import("chai");
        chai.should();
    });

    vscode.window.showInformationMessage("Start all tests.");

    it("Register Commands", () => {});
});
