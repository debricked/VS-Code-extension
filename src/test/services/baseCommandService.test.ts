import { expect, sinon } from "../setup";
import BaseCommandService from "../../services/baseCommandService";
import { StatusBarMessageHelper, Terminal, Logger } from "../../helpers";
import {
    DebrickedCommands,
    MessageStatus,
    Organization,
} from "../../constants";

describe("BaseCommandService: Test Suite", () => {
    let setStatusBarMessageStub: sinon.SinonStub;
    let createAndUseTerminalStub: sinon.SinonStub;
    let showErrorMessageStub: sinon.SinonStub;
    let logMessageByStatusStub: sinon.SinonStub;

    before(() => {
        setStatusBarMessageStub = sinon.stub(
            StatusBarMessageHelper,
            "setStatusBarMessage",
        );
        createAndUseTerminalStub = sinon.stub(Terminal, "createAndUseTerminal");
        showErrorMessageStub = sinon.stub(
            StatusBarMessageHelper,
            "showErrorMessage",
        );
        logMessageByStatusStub = sinon.stub(Logger, "logMessageByStatus");
    });

    afterEach(() => {
        sinon.resetHistory();
    });

    after(() => {
        setStatusBarMessageStub.restore();
        createAndUseTerminalStub.restore();
        showErrorMessageStub.restore();
        logMessageByStatusStub.restore();
    });

    it("should run baseCommand without errors", async () => {
        const goCliPath = "path/to/cli";
        const seqToken = "testToken";

        await BaseCommandService.baseCommand(goCliPath, seqToken);

        expect(setStatusBarMessageStub.callCount).to.equal(3);
        expect(
            createAndUseTerminalStub.calledOnceWith(
                DebrickedCommands.BASE_COMMAND.description,
                goCliPath,
                seqToken,
            ),
        ).to.be.true;
        expect(showErrorMessageStub.notCalled).to.be.true;
        expect(logMessageByStatusStub.notCalled).to.be.true;
    });

    it("should handle errors in baseCommand", async () => {
        const goCliPath = "path/to/cli";
        const seqToken = "testToken";
        const errorMessage = "Test error";
        createAndUseTerminalStub.throws(new Error(errorMessage));

        await BaseCommandService.baseCommand(goCliPath, seqToken);

        expect(setStatusBarMessageStub.callCount).to.equal(3);
        expect(
            showErrorMessageStub.calledOnceWith(
                `${Organization.name} - ${DebrickedCommands.HELP.cli_command} ${MessageStatus.ERROR}: ${errorMessage}`,
            ),
        ).to.be.true;
        expect(
            logMessageByStatusStub.calledOnceWith(
                MessageStatus.ERROR,
                sinon.match.any,
                seqToken,
            ),
        ).to.be.true;
    });
});
