// import * as os from "os";
import { expect, sinon } from "../setup";
import { InstallHelper } from "../../helpers/installHelper";
import { Logger } from "../../helpers";
import { StatusBarMessageHelper } from "../../helpers/statusBarMessageHelper";
import { Command } from "../../helpers/commandHelper";
import { Organization } from "../../constants";

describe("InstallHelper", () => {
    let installHelper: InstallHelper;
    let loggerStub: sinon.SinonStubbedInstance<typeof Logger>;
    let statusBarMessageHelperStub: sinon.SinonStubbedInstance<StatusBarMessageHelper>;
    let commandHelperStub: sinon.SinonStubbedInstance<Command>;
    let sandbox: sinon.SinonSandbox;

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

        installHelper = new InstallHelper(loggerStub as any, statusBarMessageHelperStub, commandHelperStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("getScriptPath", () => {
        it("should return correct paths for Windows", () => {
            const result = (installHelper as any).getScriptPath();
            expect(result.install).to.include(Organization.installBat);
            expect(result.command).to.equal("");
        });
    });
});
