import { expect, sinon, goCliPath, seqToken } from "../setup";
import HelpService from "../../services/helpService";
import {
    StatusBarMessageHelper,
    Terminal,
    QuickPick,
    AuthHelper,
    Logger,
} from "../../helpers";
import {
    Organization,
    MessageStatus,
    DebrickedCommands,
} from "../../constants";
import { Flag } from "../../types";

describe("HelpService: Test Suite", () => {
    let setStatusBarMessageStub: sinon.SinonStub;
    let createAndUseTerminalStub: sinon.SinonStub;
    let showErrorMessageStub: sinon.SinonStub;
    let logMessageByStatusStub: sinon.SinonStub;
    let showQuickPickStub: sinon.SinonStub;
    let getAccessTokenStub: sinon.SinonStub;

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
        showQuickPickStub = sinon.stub(QuickPick, "showQuickPick");
        getAccessTokenStub = sinon.stub(AuthHelper, "getAccessToken");
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
        getAccessTokenStub.restore();
    });

    it("should run help without errors", async () => {
        const selectedFlags = { flag: "-h" };
        const flags: Flag[] = [
            {
                label: "Help",
                flag: "-h",
                description: "help for debricked",
            },
        ];
        showQuickPickStub.resolves(selectedFlags);

        sinon.stub(DebrickedCommands, "getCommandSpecificFlags").returns(flags);
        getAccessTokenStub.resolves("access_token");

        await HelpService.help(goCliPath, seqToken);

        expect(setStatusBarMessageStub.callCount).to.equal(3);
        expect(
            createAndUseTerminalStub.calledOnceWith(
                DebrickedCommands.BASE_COMMAND.description,
                `${goCliPath} ${selectedFlags.flag} access_token`,
                seqToken,
            ),
        ).to.be.true;
        expect(showErrorMessageStub.notCalled).to.be.true;
        expect(logMessageByStatusStub.notCalled).to.be.true;
    });

    it("should handle errors in help", async () => {
        const errorMessage = "Test error";
        createAndUseTerminalStub.throws(new Error(errorMessage));

        await HelpService.help(goCliPath, seqToken);

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

    it("should not call AuthHelper.getAccessToken when the selected flag is not auth-related", async () => {
        const selectedFlags = { flag: "--other" };
        showQuickPickStub.resolves(selectedFlags);

        await HelpService.help(goCliPath, seqToken);

        expect(getAccessTokenStub.notCalled).to.be.true;
    });
});
