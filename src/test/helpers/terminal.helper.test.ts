import * as vscode from "vscode";
import { authHelper } from "../../helpers";
import { Logger } from "../../helpers/logger.helper";
import { DebrickedCommands, Messages, MessageStatus } from "../../constants";
import { expect, sinon } from "../setup";
import { Terminal } from "../../helpers/terminal.helper";

describe("Terminal Helper", () => {
    let createTerminalStub: sinon.SinonStub;
    let sendTextStub: sinon.SinonStub;
    let showStub: sinon.SinonStub;
    let getTokenStub: sinon.SinonStub;
    let logMessageByStatusStub: sinon.SinonStub;
    let getCommandSpecificFlagsStub: sinon.SinonStub;
    let terminal: Terminal;
    let sandbox: sinon.SinonSandbox;

    let mockTerminal: vscode.Terminal;
    const mockCliPath = "/mock/path/to/debricked";

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        mockTerminal = {
            sendText: () => {
                console.log("sendText not implemented");
            },
            show: () => {
                console.log("show not implemented");
            },
        } as any;
        createTerminalStub = sandbox.stub(vscode.window, "createTerminal").returns(mockTerminal);
        sendTextStub = sandbox.stub(mockTerminal, "sendText");
        showStub = sandbox.stub(mockTerminal, "show");
        getTokenStub = sandbox.stub(authHelper, "getToken");
        logMessageByStatusStub = sandbox.stub(Logger, "logMessageByStatus");
        getCommandSpecificFlagsStub = sandbox.stub(DebrickedCommands, "getCommandSpecificFlags");
        terminal = new Terminal(authHelper, Logger);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should create and use terminal without access token", async () => {
        const description = "Test Terminal";
        const cmdParams = ["-v"];
        const accessTokenRequired = false;

        await terminal.createAndUseTerminal(description, cmdParams, accessTokenRequired);

        expect(createTerminalStub.calledOnceWith(description)).to.be.true;
        expect(showStub.calledOnce).to.be.true;
    });

    it("should create and use terminal with access token", async () => {
        const description = "Test Terminal";
        const cmdParams: string[] = [];
        const accessTokenRequired = true;
        const fakeToken = "fake_access_token";

        getTokenStub.resolves(fakeToken);
        getCommandSpecificFlagsStub.returns([{ flag: "--t" }]);

        await terminal.createAndUseTerminal(description, cmdParams, accessTokenRequired);

        expect(createTerminalStub.calledOnceWith(description)).to.be.true;
        expect(showStub.calledOnce).to.be.true;
        expect(
            logMessageByStatusStub.calledOnceWith(
                MessageStatus.INFO,
                `${Messages.CMD_EXEC_WITH_ACCESS_TOKEN}: "${mockCliPath}"`,
            ),
        ).to.be.false;
    });

    it("should use existing terminal if available", async () => {
        const existingTerminal = { ...mockTerminal };
        sinon.stub(vscode.window, "activeTerminal").value(existingTerminal);

        await terminal.createAndUseTerminal("Test Terminal");

        expect(createTerminalStub.notCalled).to.be.true;
        expect(sendTextStub.calledOnce).to.be.true;
        expect(showStub.calledOnce).to.be.true;
    });
});
