import { ScanService } from "../../services";
import {
    QuickPick,
    AuthHelper,
    StatusBarMessageHelper,
    StatusMessage,
    Command,
    FileHelper,
    Logger,
} from "../../helpers";
import { DebrickedCommands, MessageStatus } from "../../constants/index";
import { expect, sinon, goCliPath, seqToken } from "../setup";

describe("ScanService Test Suite", () => {
    let sandbox: sinon.SinonSandbox;
    let commandStub: sinon.SinonStub;
    let accessTokenStub: sinon.SinonStub;
    let quickPickStub: sinon.SinonStub;
    let statusBarMessageHelperStub: sinon.SinonStub;
    let fileHelperStub: sinon.SinonStub;
    let loggerStub: sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        commandStub = sandbox.stub(Command, "executeCommand").resolves("command output");
        accessTokenStub = sandbox.stub(AuthHelper, "getAccessToken").resolves("testAccessToken");
        quickPickStub = sandbox.stub(QuickPick, "showQuickPick").resolves({ label: "Help" });
        statusBarMessageHelperStub = sandbox.stub(StatusBarMessageHelper, "setStatusBarMessage");
        fileHelperStub = sandbox.stub(FileHelper, "storeAndOpenFile").resolves();
        loggerStub = sandbox.stub(Logger, "logMessageByStatus");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should execute scan command successfully", async () => {
        await ScanService.scanService(goCliPath, seqToken);

        expect(
            statusBarMessageHelperStub.calledWith(
                StatusMessage.getStatusMessage(MessageStatus.START, DebrickedCommands.SCAN.cli_command),
            ),
        ).to.be.true;

        expect(commandStub.calledOnce).to.be.true;
        expect(fileHelperStub.calledOnce).to.be.true;

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
    });

    it("should handle errors during scan command execution", async () => {
        const error = new Error("test error");
        commandStub.rejects(error);

        await ScanService.scanService(goCliPath, seqToken);

        expect(
            statusBarMessageHelperStub.calledWith(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.SCAN.cli_command),
            ),
        ).to.be.true;

        expect(loggerStub.calledWith(MessageStatus.ERROR, error, seqToken)).to.be.true;
    });

    it("should include access token and flags in command parameters", async () => {
        await ScanService.scanService(goCliPath, seqToken);

        expect(commandStub.calledOnce).to.be.true;
        const cmdParams = commandStub.firstCall.args[1];
        expect(cmdParams).to.include("-t");
        expect(cmdParams).to.include("testAccessToken");
    });

    it("should not include access token if it is not available", async () => {
        accessTokenStub.resolves(undefined);

        await ScanService.scanService(goCliPath, seqToken);

        expect(commandStub.calledOnce).to.be.true;
        const cmdParams = commandStub.firstCall.args[1];
        expect(cmdParams).to.not.include("testAccessToken");
    });

    it("should show error message if quick pick fails", async () => {
        quickPickStub.rejects(new Error("QuickPick failed"));

        await ScanService.scanService(goCliPath, seqToken);

        expect(
            statusBarMessageHelperStub.calledWith(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.SCAN.cli_command),
            ),
        ).to.be.true;
    });
});
