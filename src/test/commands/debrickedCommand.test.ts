import * as vscode from "vscode";
import { sinon } from "../setup";
import { DebrickedCommand } from "../../commands/debrickedCommand";

describe("DebrickedCommand: Test Suite", () => {
    let sandbox: sinon.SinonSandbox;
    let context: vscode.ExtensionContext;
    let registerCommandStub: sinon.SinonStub;

    before(() => {
        sandbox = sinon.createSandbox();
        context = { subscriptions: [] } as any;
        registerCommandStub = sandbox.stub(vscode.commands, "registerCommand");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should run base command on BASE_COMMAND trigger", async () => {
        await DebrickedCommand.commands(context);
        const baseCommandCallback = registerCommandStub.getCall(0).args[1];
        await baseCommandCallback();
    });

    it("should run help command on HELP trigger", async () => {
        const helpCommandCallback = registerCommandStub.getCall(1).args[1];
        await helpCommandCallback();
    });

    it("should run scan command on SCAN trigger", async () => {
        const scanCommandCallback = registerCommandStub.getCall(2).args[1];
        await scanCommandCallback();
    });
});
