import { AuthHelper } from "../../helpers/auth.helper";
import { Logger, showInputBoxHelper } from "../../helpers";
import { sinon, expect } from "../setup";
import { Messages, Secrets } from "../../constants";

describe("Authorization Helper", () => {
    let authHelper: AuthHelper;
    let loggerStub: sinon.SinonStub;
    let promptForInputStub: sinon.SinonStub;
    let globalStateInstance: sinon.SinonStubbedInstance<any>;
    let globalStore: sinon.SinonStubbedInstance<any>;
    let sandbox: sinon.SinonSandbox;

    const FAKE_TOKEN = "fake_secret_token";
    const NEW_TOKEN = "new_secret_token";

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        loggerStub = sandbox.stub(Logger, "logInfo");
        promptForInputStub = sandbox.stub(showInputBoxHelper, "promptForInput");

        globalStateInstance = {
            getSecretData: sandbox.stub().returns(FAKE_TOKEN),
            setSecretData: sandbox.stub(),
        };

        globalStore = {
            getGlobalStateInstance: sandbox.stub().returns(globalStateInstance),
        };

        authHelper = new AuthHelper(showInputBoxHelper, Logger, globalStore);
    });

    afterEach(() => {
        sandbox.restore();
    });

    const secrets = [{ type: Secrets.ACCESS, promptMessage: Messages.ENTER_ACCESS_TOKEN }];

    secrets.forEach(({ type, promptMessage }) => {
        describe(`${type} token`, () => {
            it(`should use default ${type} token`, async () => {
                const token = await authHelper.getToken(true, type);

                expect(loggerStub.called).to.be.false;
                expect(promptForInputStub.called).to.be.false;
                expect(token).to.equal(FAKE_TOKEN);
            });

            it(`should prompt for new ${type} token when default is not available`, async () => {
                globalStateInstance.getSecretData.returns(undefined);
                promptForInputStub.resolves(NEW_TOKEN);

                const token = await authHelper.getToken(true, type);

                expect(loggerStub.calledOnceWith("InputBox Opened for tokens")).to.be.true;
                expect(promptForInputStub.calledOnce).to.be.true;
                expect(promptForInputStub.firstCall.args[0]).to.include({
                    prompt: promptMessage,
                    title: type === Secrets.ACCESS ? Messages.ACCESS_TOKEN : Messages.AUTH_RQD,
                    placeHolder: promptMessage,
                });
                expect(token).to.equal(NEW_TOKEN);
                expect(globalStateInstance.setSecretData.calledOnce).to.be.true;
            });

            it(`should use new ${type} token when useDefaultToken is false`, async () => {
                promptForInputStub.resolves(NEW_TOKEN);

                const token = await authHelper.getToken(false, type);

                expect(loggerStub.calledOnceWith("InputBox Opened for tokens")).to.be.true;
                expect(promptForInputStub.calledOnce).to.be.true;
                expect(token).to.equal(NEW_TOKEN);
                expect(globalStateInstance.setSecretData.calledOnce).to.be.true;
            });
        });
    });

    describe("setToken", () => {
        it("should set the token and show a success message", async () => {
            await authHelper.setToken(Secrets.ACCESS, NEW_TOKEN);

            expect(globalStateInstance.setSecretData.calledOnceWith(Secrets.ACCESS, NEW_TOKEN)).to.be.true;
        });
    });
});
