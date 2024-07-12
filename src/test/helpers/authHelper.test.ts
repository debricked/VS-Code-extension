import { Messages, Organization } from "../../constants/index";
import { expect, sinon } from "../setup";
import proxyquire from "proxyquire";
import path from "path";
import fs from "fs";

describe("AuthHelper", () => {
    let AuthHelper: any;
    let fsStub: any;
    let vscodeStub: any;
    let originalWorkspace: string;
    let mockWorkspacePath: string;

    beforeEach(() => {
        // Create a mock workspace in the current directory
        mockWorkspacePath = path.join(__dirname, "../../", Organization.debrickedFolder);
        console.log(mockWorkspacePath);
        if (!fs.existsSync(mockWorkspacePath)) {
            fs.mkdirSync(mockWorkspacePath);
        }

        fsStub = {
            existsSync: sinon.stub(),
            mkdirSync: sinon.stub(),
            readFileSync: sinon.stub(),
            writeFileSync: sinon.stub(),
        };

        vscodeStub = {
            window: {
                showInputBox: sinon.stub(),
            },
            workspace: {
                workspaceFolders: [
                    {
                        uri: {
                            fsPath: mockWorkspacePath,
                        },
                    },
                ],
            },
        };

        originalWorkspace = Organization.workspace;
        Object.defineProperty(Organization, "workspace", {
            value: mockWorkspacePath,
            writable: true,
        });

        AuthHelper = proxyquire("../../helpers", {
            fs: fsStub,
            vscode: vscodeStub,
            path: path,
        }).AuthHelper;
    });

    afterEach(() => {
        sinon.restore();
        Object.defineProperty(Organization, "workspace", {
            value: originalWorkspace,
            writable: false,
        });
        // Clean up the mock workspace
        if (fs.existsSync(mockWorkspacePath)) {
            fs.rmdirSync(mockWorkspacePath, { recursive: true });
        }
    });

    describe("getAccessToken", () => {
        it("should throw an error if workspace is not defined", async () => {
            Object.defineProperty(Organization, "workspace", {
                value: "",
                writable: true,
            });

            await expect(AuthHelper.getAccessToken()).to.be.rejectedWith(Messages.WS_NOT_FOUND);
        });
    });
});
