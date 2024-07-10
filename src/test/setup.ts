import * as vscode from "vscode";
import sinon from "sinon";

let expect: any;
let context: vscode.ExtensionContext;
const goCliPath = "debricked";
const seqToken = "testToken";

before(async () => {
    const chai = await import("chai");
    chai.should();
    expect = chai.expect;

    context = {
        subscriptions: [],
    } as any;
});

export { expect, context, sinon, goCliPath, seqToken };
