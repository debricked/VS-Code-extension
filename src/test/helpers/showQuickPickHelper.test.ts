// import * as vscode from "vscode";
// import { QuickPick } from "../../helpers"; // Update with the correct path to your QuickPick module
// import { expect, sinon } from "../setup";

// describe("QuickPick", () => {
//     let showQuickPickStub: sinon.SinonStub;

//     beforeEach(() => {
//         showQuickPickStub = sinon.stub(vscode.window, "showQuickPick");
//     });

//     afterEach(() => {
//         sinon.restore();
//     });

//     it("should show quick pick and return the selected item", async () => {
//         const items = [{ label: "Option 1" }, { label: "Option 2" }];
//         const selectedItem = items[0];

//         showQuickPickStub.resolves(selectedItem);

//         const result = await QuickPick.showQuickPick(items, "Select an option");

//         expect(
//             showQuickPickStub.calledOnceWith(items, {
//                 placeHolder: "Select an option",
//                 canPickMany: false,
//             }),
//         ).to.be.true;

//         expect(result).to.equal(selectedItem);
//     });

//     it("should show quick pick with canPickMany option and return the selected items", async () => {
//         const items = [{ label: "Option 1" }, { label: "Option 2" }];
//         const selectedItems = [items[0], items[1]];

//         showQuickPickStub.resolves(selectedItems);

//         const result = await QuickPick.showQuickPick(items, "Select options", true);

//         expect(
//             showQuickPickStub.calledOnceWith(items, {
//                 placeHolder: "Select options",
//                 canPickMany: true,
//             }),
//         ).to.be.true;

//         expect(result).to.deep.equal(selectedItems);
//     });

//     it("should return undefined if no item is selected", async () => {
//         const items = [{ label: "Option 1" }, { label: "Option 2" }];

//         showQuickPickStub.resolves(undefined);

//         const result = await QuickPick.showQuickPick(items, "Select an option");

//         expect(
//             showQuickPickStub.calledOnceWith(items, {
//                 placeHolder: "Select an option",
//                 canPickMany: false,
//             }),
//         ).to.be.true;

//         expect(result).to.be.undefined;
//     });

//     it("should handle empty items array", async () => {
//         const items: vscode.QuickPickItem[] = [];

//         showQuickPickStub.resolves(undefined);

//         const result = await QuickPick.showQuickPick(items, "Select an option");

//         expect(
//             showQuickPickStub.calledOnceWith(items, {
//                 placeHolder: "Select an option",
//                 canPickMany: false,
//             }),
//         ).to.be.true;

//         expect(result).to.be.undefined;
//     });
// });
