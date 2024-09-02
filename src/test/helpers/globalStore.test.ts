// import * as vscode from "vscode";
import { expect, sinon } from "../setup";
import { globalStore } from "../../helpers";
import { GlobalStore } from "../../helpers/globalStore";

describe("Global Store", () => {
    let sandbox: sinon.SinonSandbox;
    let globalStoreInstanceStub: sinon.SinonStub;
    let globalStoreGetSequenceIDStub: sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        globalStoreInstanceStub = sandbox.stub(GlobalStore, "getInstance");
        globalStoreGetSequenceIDStub = sandbox.stub(globalStore, "getSequenceID");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should getInstance return globalStore", () => {
        GlobalStore.getInstance();
        expect(globalStoreInstanceStub.returns(globalStore));
    });

    it("should call getSequenceID", () => {
        globalStore.getSequenceID();
        expect(globalStoreGetSequenceIDStub.returns);
    });
});
