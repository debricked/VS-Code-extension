import { expect, sinon } from "../setup";
import * as vscode from "vscode";
import { ShowInputBoxHelper } from "../../helpers/showInputBoxHelper";
import { InputBoxOptions } from "../../types";

describe("ShowInputBoxHelper", () => {
    let showInputBoxHelper: ShowInputBoxHelper;
    let windowStub: sinon.SinonStubbedInstance<typeof vscode.window>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        windowStub = sandbox.stub(vscode.window);
        showInputBoxHelper = new ShowInputBoxHelper();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should call vscode.window.showInputBox with correct options", async () => {
        const options: InputBoxOptions = {
            prompt: "Enter your name",
            ignoreFocusOut: true,
            password: false,
            title: "Name Input",
            placeHolder: "John Doe",
            value: "Jane",
        };

        windowStub.showInputBox.resolves("Test Input");

        const result = await showInputBoxHelper.promptForInput(options);

        expect(windowStub.showInputBox.calledOnce).to.be.true;
        expect(windowStub.showInputBox.firstCall.args[0]).to.deep.equal({
            prompt: "Enter your name",
            ignoreFocusOut: true,
            password: false,
            title: "Name Input",
            placeHolder: "John Doe",
            value: "Jane",
        });
        expect(result).to.equal("Test Input");
    });

    it("should use default values for ignoreFocusOut and password if not provided", async () => {
        const options: InputBoxOptions = {
            prompt: "Enter your name",
        };

        windowStub.showInputBox.resolves("Test Input");

        await showInputBoxHelper.promptForInput(options);

        expect(windowStub.showInputBox.firstCall.args[0]).to.deep.include({
            ignoreFocusOut: true,
            password: false,
        });
    });

    it("should return defaultValue if input is undefined", async () => {
        const options: InputBoxOptions = {
            prompt: "Enter your name",
        };

        windowStub.showInputBox.resolves(undefined);

        const result = await showInputBoxHelper.promptForInput(options, "Default Name");

        expect(result).to.equal("Default Name");
    });

    it("should return undefined if input is undefined and no defaultValue is provided", async () => {
        const options: InputBoxOptions = {
            prompt: "Enter your name",
        };

        windowStub.showInputBox.resolves(undefined);

        const result = await showInputBoxHelper.promptForInput(options);

        expect(result).to.be.undefined;
    });

    it("should not include optional properties if they are not provided", async () => {
        const options: InputBoxOptions = {
            prompt: "Enter your name",
        };

        windowStub.showInputBox.resolves("Test Input");

        await showInputBoxHelper.promptForInput(options);

        const calledOptions = windowStub.showInputBox.firstCall.args[0];
        expect(calledOptions).to.not.have.property("title");
        expect(calledOptions).to.not.have.property("placeHolder");
        expect(calledOptions).to.not.have.property("value");
    });
});
