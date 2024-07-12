import * as vscode from "vscode";
import * as path from "path";
import proxyquire from "proxyquire";
import { Common } from "../../helpers";
import * as crypto from "crypto";
import { expect, sinon } from "../setup";

describe("Common", () => {
    let showInputBoxStub: sinon.SinonStub;
    let fsExistsSyncStub: sinon.SinonStub;
    let fsReadFileSyncStub: sinon.SinonStub;
    let fsWriteFileSyncStub: sinon.SinonStub;
    let fsMkdirSyncStub: sinon.SinonStub;

    const mockPath = path.join("mockWorkspace", ".debricked", "debricked_data.json");

    before(() => {
        showInputBoxStub = sinon.stub(vscode.window, "showInputBox");

        fsExistsSyncStub = sinon.stub();
        fsReadFileSyncStub = sinon.stub();
        fsWriteFileSyncStub = sinon.stub();
        fsMkdirSyncStub = sinon.stub();

        proxyquire("../../helpers", {
            fs: {
                existsSync: fsExistsSyncStub,
                readFileSync: fsReadFileSyncStub,
                writeFileSync: fsWriteFileSyncStub,
                mkdirSync: fsMkdirSyncStub,
            },
        }).Common;
    });

    afterEach(() => {
        sinon.resetHistory();
    });

    after(() => {
        showInputBoxStub.restore();
    });

    it("should get input from the user", async () => {
        const prompt = "Enter something";
        showInputBoxStub.resolves("test input");

        const result = await Common.getInput(prompt);

        expect(result).to.equal("test input");
        expect(showInputBoxStub.calledOnceWith({ prompt })).to.be.true;
    });

    it("should retrieve data from debricked data file", async () => {
        const key = "testKey";
        const value = "testValue";
        fsExistsSyncStub.withArgs(mockPath).returns(true);
        fsReadFileSyncStub.withArgs(mockPath, "utf-8").returns(JSON.stringify({ [key]: value }));

        const result = await Common.getFromDebrickedData(key);

        expect(result).to.equal(value);
    });

    it("should return 'unknown-user' if data not found in debricked data file", async () => {
        fsExistsSyncStub.withArgs(mockPath).returns(false);

        const result = await Common.getFromDebrickedData("testKey");

        expect(result).to.equal("testValue");
    });

    it("should generate hash code", () => {
        const input = "test input";
        const hashCode = Common.generateHashCode(input);

        expect(hashCode).to.equal(crypto.createHash("sha256").update(input).digest("hex"));
    });

    it("should not generate new user ID if user ID is known", async () => {
        fsExistsSyncStub.withArgs(mockPath).returns(true);
        fsReadFileSyncStub.withArgs(mockPath, "utf-8").returns(JSON.stringify({ user_id: "known-user" }));

        await Common.checkUserId();

        expect(fsWriteFileSyncStub.notCalled).to.be.true;
    });
});
