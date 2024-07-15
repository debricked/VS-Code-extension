import * as path from "path";
import proxyquire from "proxyquire";
import { expect, mockWorkspacePath, sinon } from "../setup";
import { Organization } from "../../constants/index";

describe("FileHelper", () => {
    let fsExistsSyncStub: sinon.SinonStub;
    let fsMkdirSyncStub: sinon.SinonStub;
    let fsWriteFileSyncStub: sinon.SinonStub;
    let vscodeWorkspaceStub: sinon.SinonStub;
    let vscodeWindowStub: sinon.SinonStub;
    let logMessageByStatusStub: sinon.SinonStub;
    let FileHelper: any;

    const mockPath = "reports";
    const fileName = "testReport.txt";
    const content = "Test content";
    const filePath = path.join(mockWorkspacePath, mockPath, fileName);

    beforeEach(() => {
        fsExistsSyncStub = sinon.stub();
        fsMkdirSyncStub = sinon.stub();
        fsWriteFileSyncStub = sinon.stub();
        vscodeWorkspaceStub = sinon.stub();
        vscodeWindowStub = sinon.stub();
        logMessageByStatusStub = sinon.stub();

        FileHelper = proxyquire("../../helpers", {
            fs: {
                existsSync: fsExistsSyncStub,
                mkdirSync: fsMkdirSyncStub,
                writeFileSync: fsWriteFileSyncStub,
            },
            vscode: {
                workspace: {
                    openTextDocument: vscodeWorkspaceStub.resolves({}),
                },
                window: {
                    showTextDocument: vscodeWindowStub.resolves({}),
                },
            },
            "./loggerHelper": {
                Logger: {
                    logMessageByStatus: logMessageByStatusStub,
                },
            },
            "../constants/index": {
                Organization: {
                    ...Organization,
                    workspace: "",
                    report: ".debricked/reports",
                },
            },
        }).FileHelper;
    });

    afterEach(() => {
        sinon.resetHistory();
    });

    it("should create a folder and store content in a file if folder does not exist", async () => {
        fsExistsSyncStub.returns(false);

        const result = await FileHelper.storeResultInFile(fileName, content);

        expect(result).to.equal(filePath);
    });

    it("should store content in a file if folder exists", async () => {
        fsExistsSyncStub.returns(true);

        const result = await FileHelper.storeResultInFile(fileName, content);

        expect(result).to.equal(filePath);
    });
});
