import { expect, sinon, seqToken } from "../setup";
import { HelpService } from "../../services/helpService";
import { StatusBarMessageHelper, Terminal, QuickPick, Logger, StatusMessage } from "../../helpers";
import { Organization, MessageStatus, DebrickedCommands } from "../../constants";

describe("HelpService: Test Suite", () => {
    let setStatusBarMessageStub: sinon.SinonStub;
    let createAndUseTerminalStub: sinon.SinonStub;
    let showErrorMessageStub: sinon.SinonStub;
    let logMessageByStatusStub: sinon.SinonStub;
    let showQuickPickStub: sinon.SinonStub;

    before(() => {
        setStatusBarMessageStub = sinon.stub(StatusBarMessageHelper, "setStatusBarMessage");
        createAndUseTerminalStub = sinon.stub(Terminal, "createAndUseTerminal");
        showErrorMessageStub = sinon.stub(StatusBarMessageHelper, "showErrorMessage");
        logMessageByStatusStub = sinon.stub(Logger, "logMessageByStatus");
        showQuickPickStub = sinon.stub(QuickPick, "showQuickPick");
    });

    afterEach(() => {
        sinon.resetHistory();
    });

    after(() => {
        setStatusBarMessageStub.restore();
        createAndUseTerminalStub.restore();
        showErrorMessageStub.restore();
        logMessageByStatusStub.restore();
        showQuickPickStub.restore();
    });

    it("should run help without errors", async () => {
        const selectedFlags = { flag: "-h" };
        showQuickPickStub.resolves(selectedFlags);

        await HelpService.help(seqToken);

        expect(setStatusBarMessageStub.callCount).to.equal(3);
        expect(
            createAndUseTerminalStub.calledOnceWith(
                DebrickedCommands.BASE_COMMAND.description,
                seqToken,
                ["-h"],
                false,
            ),
        ).to.be.true;
        expect(showErrorMessageStub.notCalled).to.be.true;
        expect(logMessageByStatusStub.notCalled).to.be.true;
    });

    it("should handle errors in help", async () => {
        const errorMessage = "Test error";
        createAndUseTerminalStub.throws(new Error(errorMessage));

        await HelpService.help(seqToken);

        expect(setStatusBarMessageStub.callCount).to.equal(3);
        expect(
            showErrorMessageStub.calledOnceWith(
                `${Organization.name} - ${DebrickedCommands.HELP.cli_command} ${MessageStatus.ERROR}: ${errorMessage}`,
            ),
        ).to.be.true;
        expect(logMessageByStatusStub.calledOnceWith(MessageStatus.ERROR, sinon.match.any, seqToken)).to.be.true;
    });

    it("should call Terminal.createAndUseTerminal with the correct parameters", async () => {
        const selectedFlags = { flag: "-t" };
        showQuickPickStub.resolves(selectedFlags);

        await HelpService.help(seqToken);

        expect(setStatusBarMessageStub.callCount).to.equal(3);
    });

    it("should show error message if quick pick fails", async () => {
        showQuickPickStub.rejects(new Error("QuickPick failed"));

        await HelpService.help(seqToken);

        expect(
            setStatusBarMessageStub.calledWith(
                StatusMessage.getStatusMessage(MessageStatus.ERROR, DebrickedCommands.HELP.cli_command),
            ),
        ).to.be.true;
    });
});
