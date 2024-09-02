import * as vscode from "vscode";
import { sinon, expect } from "../setup";
import { ShowQuickPickHelper } from "../../helpers/showQuickPickHelper";

describe("ShowQuickPickHelper", () => {
    let showQuickPickHelper: ShowQuickPickHelper;
    let showQuickPickStub: sinon.SinonStub;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        showQuickPickHelper = new ShowQuickPickHelper();
        showQuickPickStub = sandbox.stub(vscode.window, "showQuickPick");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should call vscode.window.showQuickPick with correct parameters", async () => {
        const items: vscode.QuickPickItem[] = [{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }];
        const placeHolder = "Select an item";
        const canPickMany = false;

        await showQuickPickHelper.showQuickPick(items, placeHolder, canPickMany);

        expect(showQuickPickStub.calledOnce).to.be.true;
        expect(showQuickPickStub.firstCall.args[0]).to.deep.equal(items);
        expect(showQuickPickStub.firstCall.args[1]).to.deep.equal({
            placeHolder,
            canPickMany,
        });
    });

    it("should return the selected item", async () => {
        const items: vscode.QuickPickItem[] = [{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }];
        const placeHolder = "Select an item";
        const selectedItem = items[1];

        showQuickPickStub.resolves(selectedItem);

        const result = await showQuickPickHelper.showQuickPick(items, placeHolder);

        expect(result).to.equal(selectedItem);
    });

    it("should handle cancellation (undefined return)", async () => {
        const items: vscode.QuickPickItem[] = [{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }];
        const placeHolder = "Select an item";

        showQuickPickStub.resolves(undefined);

        const result = await showQuickPickHelper.showQuickPick(items, placeHolder);

        expect(result).to.be.undefined;
    });

    it("should allow multiple selections when canPickMany is true", async () => {
        const items: vscode.QuickPickItem[] = [{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }];
        const placeHolder = "Select items";
        const canPickMany = true;

        await showQuickPickHelper.showQuickPick(items, placeHolder, canPickMany);

        expect(showQuickPickStub.firstCall.args[1].canPickMany).to.be.true;
    });
});
