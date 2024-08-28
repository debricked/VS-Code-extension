import { AuthHelper } from "../../helpers/authHelper";
import { Logger, showInputBoxHelper, statusBarMessageHelper } from "../../helpers";
import { sinon, expect } from "../setup";
import { Messages, TokenType } from "../../constants";

describe("Authorization Helper", () => {
    let authHelper: AuthHelper;
    let logInfoStub: sinon.SinonStub;
    let promptForInputStub: sinon.SinonStub;
    let statusBarMessageHelperStub: sinon.SinonStub;
    let globalStateInstance: sinon.SinonStubbedInstance<any>;
    let globalStore: sinon.SinonStubbedInstance<any>;

    const FAKE_TOKEN = "fake_secret_token";
    const NEW_TOKEN = "new_secret_token";

    beforeEach(() => {
        logInfoStub = sinon.stub(Logger, "logInfo");
        promptForInputStub = sinon.stub(showInputBoxHelper, "promptForInput");
        statusBarMessageHelperStub = sinon.stub(statusBarMessageHelper, "showInformationMessage");

        globalStateInstance = {
            getSecretData: sinon.stub().returns(FAKE_TOKEN),
            setSecretData: sinon.stub(),
        };

        globalStore = {
            getGlobalStateInstance: sinon.stub().returns(globalStateInstance),
        };

        authHelper = new AuthHelper(showInputBoxHelper, statusBarMessageHelper, Logger, globalStore);
    });

    afterEach(() => {
        sinon.restore();
    });

    const tokenTypes = [
        { type: TokenType.ACCESS, message: Messages.ACCESS_TOKEN_SAVED },
        { type: TokenType.BEARER, message: Messages.BEARER_TOKEN_SAVED },
    ];

    tokenTypes.forEach(({ type, message }) => {
        describe(`${type} token`, () => {
            it(`should use default ${type} token`, async () => {
                const token = await authHelper.getToken(true, type);

                expect(logInfoStub.calledOnceWith("InputBox Opened for tokens")).to.be.false;
                expect(promptForInputStub.notCalled).to.be.true;
                expect(token).to.be.equal(FAKE_TOKEN);
            });

            it(`should use new ${type} token`, async () => {
                promptForInputStub.resolves(NEW_TOKEN);

                const token = await authHelper.getToken(false, type);

                expect(logInfoStub.calledOnceWith("InputBox Opened for tokens")).to.be.true;
                expect(promptForInputStub.calledOnce).to.be.true;
                expect(token).to.be.equal(NEW_TOKEN);
                expect(globalStateInstance.setSecretData.calledOnce).to.be.true;
                expect(statusBarMessageHelperStub.calledOnceWith(message)).to.be.true;
            });
        });
    });
});
