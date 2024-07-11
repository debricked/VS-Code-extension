import * as vscode from "vscode";
import { expect, sinon } from "../setup";
import { DebrickedCommand } from "../../commands/debrickedCommand";
import { DebrickedCommands } from "../../constants";
import { BaseCommandService } from "../../services";
import { Common } from "../../helpers";

describe("DebrickedCommand: Test Suite", () => {
    let sandbox: sinon.SinonSandbox;
    let context: vscode.ExtensionContext;
    let generateHashCodeStub: sinon.SinonStub;
    let baseCommandStub: sinon.SinonStub;
    let createFileSystemWatcherStub: sinon.SinonStub;
    let registerCommandStub: sinon.SinonStub;

    before(() => {
        sandbox = sinon.createSandbox();
        context = { subscriptions: [] } as any;

        generateHashCodeStub = sandbox.stub(Common, "generateHashCode").returns("testHashCode");
        baseCommandStub = sandbox.stub(BaseCommandService, "baseCommand").resolves();
        createFileSystemWatcherStub = sandbox.stub(vscode.workspace, "createFileSystemWatcher").returns({
            onDidChange: sandbox.stub(),
            onDidCreate: sandbox.stub(),
            onDidDelete: sandbox.stub(),
            dispose: sandbox.stub(),
        } as any);
        registerCommandStub = sandbox.stub(vscode.commands, "registerCommand");
    });

    afterEach(() => {
        sandbox.restore();
    });

    // it("should register commands and file watchers", async () => {
    //     await DebrickedCommand.commands(context);

    //     expect(registerCommandStub.callCount).to.equal(3);
    //     expect(registerCommandStub.calledWith(DebrickedCommands.BASE_COMMAND.command)).to.be.true;
    //     expect(registerCommandStub.calledWith(DebrickedCommands.HELP.command)).to.be.true;
    //     expect(registerCommandStub.calledWith(DebrickedCommands.SCAN.command)).to.be.true;

    //     const watcher = createFileSystemWatcherStub.returnValues[0];
    //     expect(watcher.onDidChange.calledOnce).to.be.true;
    //     expect(watcher.onDidCreate.calledOnce).to.be.true;
    //     expect(watcher.onDidDelete.calledOnce).to.be.true;

    //     expect(context.subscriptions.length).to.equal(4);
    // });

    it("should run base command on BASE_COMMAND trigger", async () => {
        await DebrickedCommand.commands(context);
        const baseCommandCallback = registerCommandStub.getCall(0).args[1];
        await baseCommandCallback();

        expect(generateHashCodeStub.calledOnceWith(DebrickedCommands.BASE_COMMAND.command)).to.be.true;
        expect(baseCommandStub.calledOnce).to.be.true;
    });

    it("should run help command on HELP trigger", async () => {
        const helpCommandCallback = registerCommandStub.getCall(1).args[1];
        await helpCommandCallback();
    });

    it("should run scan command on SCAN trigger", async () => {
        const scanCommandCallback = registerCommandStub.getCall(2).args[1];
        await scanCommandCallback();
    });

    it("should runDebrickedScan on package.json change", async () => {
        createFileSystemWatcherStub.returnValues[0];
        const uri = { path: "some/path/package.json" } as vscode.Uri;

        await DebrickedCommand.runDebrickedScan(uri);
    });
});
