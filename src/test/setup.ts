import * as vscode from "vscode";
import sinon from "sinon";
import { Organization } from "../constants/index";
import path from "path";

let expect: any;
let context: vscode.ExtensionContext;
const goCliPath = "debricked";
const seqToken = "testToken";
const mockWorkspacePath = path.join(__dirname, "../../", Organization.debrickedFolder);

before(async () => {
    const chai = await import("chai");
    const chaiAsPromised = await import("chai-as-promised");
    chai.should();
    chai.use(chaiAsPromised.default);
    expect = chai.expect;

    context = {
        subscriptions: [],
    } as any;
});

export { expect, context, sinon, goCliPath, seqToken, mockWorkspacePath };
