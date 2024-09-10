import { expect, sinon } from "../setup";
import { Command } from "../../helpers/commandHelper";
import { AuthHelper } from "../../helpers/authHelper";
import { Logger } from "../../helpers/loggerHelper";
import * as vscode from "vscode";

describe("Command", () => {
    describe("executeAsyncCommand", () => {
        it("should throw an error if no workspace folder is open", async () => {
            const authHelperStub = sinon.createStubInstance(AuthHelper);
            const loggerStub = {
                logMessageByStatus: sinon.stub(),
            } as sinon.SinonStubbedInstance<typeof Logger>;
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
