import { expect, sinon } from "../setup";
import { InstallHelper } from "../../helpers/installHelper";
import { Logger } from "../../helpers";
import { StatusBarMessageHelper } from "../../helpers/statusBarMessageHelper";
import { Command } from "../../helpers/commandHelper";
import { Messages, MessageStatus, Organization } from "../../constants";

describe("InstallHelper", () => {
    let installHelper: InstallHelper;
    let loggerStub: sinon.SinonStubbedInstance<typeof Logger>;
    let statusBarMessageHelperStub: sinon.SinonStubbedInstance<StatusBarMessageHelper>;
    let commandHelperStub: sinon.SinonStubbedInstance<Command>;
    let sandbox: sinon.SinonSandbox;
    let osPlatform: string;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        loggerStub = {
            logInfo: sandbox.stub(),
            logMessageByStatus: sandbox.stub(),
        } as any;

        statusBarMessageHelperStub = {
            showInformationMessage: sandbox.stub(),
        } as any;

        commandHelperStub = {
            executeAsyncCommand: sandbox.stub(),
        } as any;
    });

    afterEach(() => {
        sandbox.restore();
    });

    const createInstallerObj = (osPlatform: string) => {
        return new InstallHelper(loggerStub as any, statusBarMessageHelperStub, commandHelperStub, osPlatform);
    };

    describe("getScriptPath", () => {
        it("should return correct paths for Windows", () => {
            osPlatform = Organization.osWin32;
            installHelper = createInstallerObj(osPlatform);

            const result = (installHelper as any).getScriptPath();
            expect(result.install).to.include(Organization.installBat);
            expect(result.command).to.equal("");
        });

        it("should return correct paths for Linux", () => {
            osPlatform = Organization.osLinux;
            installHelper = createInstallerObj(osPlatform);

            const result = (installHelper as any).getScriptPath();
            expect(result.install).to.include(Organization.installSh);
            expect(result.command).to.equal(Organization.bash);
        });

        it("should return correct paths for macOS", () => {
            osPlatform = Organization.osDarwin;
            installHelper = createInstallerObj(osPlatform);

            const result = (installHelper as any).getScriptPath();
            expect(result.install).to.include(Organization.installSh);
            expect(result.command).to.equal(Organization.bash);
        });

        it("should throw an error for unsupported OS", () => {
            osPlatform = "unsupported";
            installHelper = createInstallerObj(osPlatform);

            expect(() => (installHelper as any).getScriptPath()).to.throw(Messages.UNSUPPORTED_OS);
        });
    });

    describe("runInstallScript", () => {
        it("should run installation script successfully", async () => {
            osPlatform = Organization.osLinux;
            installHelper = createInstallerObj(osPlatform);

            commandHelperStub.executeAsyncCommand.resolves("Installation successful");

            await installHelper.runInstallScript();

            expect(loggerStub.logMessageByStatus.calledWith(MessageStatus.INFO, "Starting installation...")).to.be.true;
            expect(commandHelperStub.executeAsyncCommand.calledOnce).to.be.true;
            expect(loggerStub.logMessageByStatus.calledWith(MessageStatus.INFO, Messages.INSTALLATION_SUCCESS)).to.be
                .true;
            expect(statusBarMessageHelperStub.showInformationMessage.calledWith("CLI installed successfully")).to.be
                .true;
        });

        it("should handle installation errors", async () => {
            osPlatform = Organization.osLinux;
            installHelper = createInstallerObj(osPlatform);

            const error = new Error("Installation failed");
            commandHelperStub.executeAsyncCommand.rejects(error);

            try {
                await installHelper.runInstallScript();
                expect.fail("Should have thrown an error");
            } catch (e) {
                expect(e).to.equal(error);
            }

            expect(loggerStub.logMessageByStatus.calledWith(MessageStatus.INFO, "Starting installation...")).to.be.true;
            expect(commandHelperStub.executeAsyncCommand.calledOnce).to.be.true;
            expect(statusBarMessageHelperStub.showInformationMessage.called).to.be.false;
        });
    });
});
