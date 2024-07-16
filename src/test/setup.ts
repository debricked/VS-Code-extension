import * as vscode from "vscode";
import sinon from "sinon";
import { Organization } from "../constants/index";
import path from "path";

let expect: Chai.ExpectStatic;
let assert: Chai.AssertStatic;
let context: vscode.ExtensionContext;
const goCliPath = "debricked";
const seqToken = "testToken";
const mockWorkspacePath = path.join(Organization.workspace, Organization.debrickedFolder);

before(async () => {
    const chai = await import("chai");
    const chaiAsPromised = await import("chai-as-promised");
    chai.should();
    chai.use(chaiAsPromised.default);
    expect = chai.expect;
    assert = chai.assert;
    context = {
        subscriptions: [],
    } as any;
});

export { expect, context, sinon, goCliPath, seqToken, mockWorkspacePath, assert };
