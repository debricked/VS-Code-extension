import { expect, sinon } from "../setup";
import { Command } from "../../helpers/commandHelper";
import { AuthHelper } from "../../helpers/authHelper";
import { Logger } from "../../helpers/loggerHelper";
import * as vscode from "vscode";

describe("Command", () => {
    let loggerStub: sinon.SinonStubbedInstance<typeof Logger>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        loggerStub = {
            logInfo: sandbox.stub(),
            logMessageByStatus: sandbox.stub(),
            logError: sandbox.stub(),
        } as any;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("executeAsyncCommand", () => {
        it("should throw an error if no workspace folder is open", async () => {
            const authHelperStub = sinon.createStubInstance(AuthHelper);

            const vscodeWorkspaceStub = sinon.stub(vscode.workspace, "workspaceFolders");
            vscodeWorkspaceStub.get(() => undefined);

            const commandInstance = new Command(authHelperStub, loggerStub);
            const command = "test-command";

            try {
                await commandInstance.executeAsyncCommand(command);
                expect.fail("Expected an error to be thrown");
            } catch (error: any) {
                expect(error.message).to.equal("No workspace folder open");
            }
        });
    });
});
