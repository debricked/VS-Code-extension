import { ScanService } from "../../services/scanService";
import { QuickPick, StatusBarMessageHelper, StatusMessage, Terminal, Logger } from "../../helpers";
import { DebrickedCommands, MessageStatus, Organization } from "../../constants";
import { expect, sinon, seqToken } from "../setup";

describe("ScanService Test Suite", () => {
    let sandbox: sinon.SinonSandbox;
    let quickPickStub: sinon.SinonStub;
    let statusBarMessageHelperStub: sinon.SinonStub;
    let terminalStub: sinon.SinonStub;
    let loggerStub: sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        quickPickStub = sandbox.stub(QuickPick, "showQuickPick").resolves({ label: "Help" });
        statusBarMessageHelperStub = sandbox.stub(StatusBarMessageHelper, "setStatusBarMessage");
        terminalStub = sandbox.stub(Terminal, "createAndUseTerminal");
        loggerStub = sandbox.stub(Logger, "logMessageByStatus");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should execute scan command successfully", async () => {
        await ScanService.scanService(seqToken);

        expect(
            statusBarMessageHelperStub.calledWith(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.SCAN.cli_command),
            ),
        ).to.be.true;

        expect(
            statusBarMessageHelperStub.calledWith(
                StatusMessage.getStatusMessage(MessageStatus.COMPLETE, DebrickedCommands.SCAN.cli_command),
            ),
        ).to.be.true;

        expect(
            statusBarMessageHelperStub.calledWith(
                StatusMessage.getStatusMessage(MessageStatus.FINISHED, DebrickedCommands.SCAN.cli_command),
            ),
        ).to.be.true;

        expect(loggerStub.notCalled).to.be.true;
    });

    it("should include flags in command parameters", async () => {
        await ScanService.scanService(seqToken);

        expect(terminalStub.calledOnce).to.be.true;
        const cmdParams = terminalStub.firstCall.args[2];
        expect(cmdParams).to.include("scan");
        expect(cmdParams).to.include(Organization.workspace);
    });

    it("should not include flags if none are selected", async () => {
        quickPickStub.resolves(undefined);

        await ScanService.scanService(seqToken);

        expect(terminalStub.calledOnce).to.be.true;
        const cmdParams = terminalStub.firstCall.args[2];
        expect(cmdParams).to.include("scan");
        expect(cmdParams).to.include(Organization.workspace);
        expect(cmdParams).to.not.include("-h");
    });

    it("should show error message if quick pick fails", async () => {
        quickPickStub.rejects(new Error("QuickPick failed"));

        await ScanService.scanService(seqToken);

        expect(
            statusBarMessageHelperStub.calledWith(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.SCAN.cli_command),
            ),
        ).to.be.true;
    });
});
