import { sinon } from "../setup";
import { BaseCommandService, HelpService } from "../../services";
import { Common } from "../../helpers";

describe("DebrickedCommand: Test Suite", () => {
    let baseCommandStub: sinon.SinonStub;
    let helpStub: sinon.SinonStub;
    let generateHashCodeStub: sinon.SinonStub;

    before(async () => {
        baseCommandStub = sinon.stub(BaseCommandService, "baseCommand");
        helpStub = sinon.stub(HelpService, "help");
        generateHashCodeStub = sinon.stub(Common, "generateHashCode");
    });

    afterEach(() => {
        sinon.resetHistory();
    });

    after(() => {
        baseCommandStub.restore();
        helpStub.restore();
        generateHashCodeStub.restore();
    });

    it("should register BASE_COMMAND and call BaseCommandService.baseCommand", async () => {
        // generateHashCodeStub
        //     .withArgs(DebrickedCommands.BASE_COMMAND.command)
        //     .returns(seqToken);
        // console.log(context.subscriptions);
        // const baseCommand = context.subscriptions.find(
        //     (sub) =>
        //         (sub as any).command === DebrickedCommands.BASE_COMMAND.command,
        // ) as vscode.Disposable;
        // expect(baseCommand).to.not.be.undefined;
    });
});
