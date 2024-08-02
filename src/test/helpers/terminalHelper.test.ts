import * as vscode from "vscode";
import { terminal } from "../../helpers";
import { Logger } from "../../helpers";
import { Messages, Organization } from "../../constants";
import { expect, sinon } from "../setup";

describe("Terminal", () => {
    let createTerminalStub: sinon.SinonStub;
    let sendTextStub: sinon.SinonStub;
    let showStub: sinon.SinonStub;
    let getAccessTokenStub: sinon.SinonStub;
    let logMessageStub: sinon.SinonStub;

    const mockTerminal: vscode.Terminal = {
        sendText: () => {},
        show: () => {},
    } as any;

    before(() => {
        createTerminalStub = sinon.stub(vscode.window, "createTerminal").returns(mockTerminal);
        sendTextStub = sinon.stub(mockTerminal, "sendText");
        showStub = sinon.stub(mockTerminal, "show");
        logMessageStub = sinon.stub(Logger, "logMessage");
    });

    afterEach(() => {
        sinon.resetHistory();
    });

    after(() => {
        createTerminalStub.restore();
        sendTextStub.restore();
        showStub.restore();
        getAccessTokenStub.restore();
        logMessageStub.restore();
    });

    it("should create and use terminal without access token", async () => {
        const description = "Test Terminal";
        const cmdParams = ["-v"];
        const accessTokenRequired = false;

        await terminal.createAndUseTerminal(description, cmdParams, accessTokenRequired);

        expect(createTerminalStub.calledOnceWith(description)).to.be.true;
        expect(sendTextStub.calledOnceWith(`${Organization.debrickedCli} ${cmdParams.join(" ")}`)).to.be.true;
        expect(showStub.calledOnce).to.be.true;
        expect(
            logMessageStub.calledOnceWith(
                `${Messages.CMD_EXEC_WITHOUT_ACCESS_TOKEN}: ${Organization.debrickedCli} ${cmdParams.join(" ")}`,
            ),
        ).to.be.true;
    });

    it("should create and use terminal with access token", async () => {
        const description = "Test Terminal";
        const cmdParams = ["-t", "access_token"];
        const accessTokenRequired = true;

        await terminal.createAndUseTerminal(description, cmdParams, accessTokenRequired);

        expect(createTerminalStub.calledOnceWith(description)).to.be.true;
        expect(sendTextStub.calledOnceWith(`${Organization.debrickedCli} ${cmdParams.join(" ")}`)).to.be.true;
        expect(showStub.calledOnce).to.be.true;
        expect(
            logMessageStub.calledOnceWith(
                `${Messages.CMD_EXEC_WITH_ACCESS_TOKEN}: ${Organization.debrickedCli} ${cmdParams.join(" ")}`,
            ),
        ).to.be.true;
    });
});
