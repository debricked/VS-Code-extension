import * as vscode from "vscode";
import { Common } from "../../helpers/commonHelper";
import { Logger } from "../../helpers/loggerHelper";
import { ShowInputBoxHelper } from "../../helpers/showInputBoxHelper";
import { GlobalStore } from "../../helpers/globalStore";
import { MessageStatus, Organization } from "../../constants";
import { expect, sinon } from "../setup";

describe("Common Helper", () => {
    let common: Common;
    let loggerStub: sinon.SinonStubbedInstance<typeof Logger>;
    let showInputBoxHelperStub: sinon.SinonStubbedInstance<ShowInputBoxHelper>;
    let globalStoreStub: sinon.SinonStubbedInstance<GlobalStore>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        loggerStub = {
            logMessageByStatus: sandbox.stub(),
        } as any;
        showInputBoxHelperStub = {
            promptForInput: sandbox.stub(),
        } as any;
        globalStoreStub = {
            getGlobalStateInstance: sandbox.stub(),
            setUserId: sandbox.stub(),
            getRepository: sandbox.stub(),
        } as any;

        common = new Common(loggerStub, showInputBoxHelperStub, globalStoreStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("getInput", () => {
        it("should call promptForInput with the given prompt", async () => {
            const prompt = "Test prompt";
            await common.getInput(prompt);
            expect(showInputBoxHelperStub.promptForInput.calledOnceWith({ prompt })).to.be.true;
        });
    });

    describe("generateHashCode", () => {
        it("should generate a consistent hash for a given input", () => {
            const input = "test input";
            const hash1 = common.generateHashCode(input);
            const hash2 = common.generateHashCode(input);
            expect(hash1).to.equal(hash2);
        });

        it("should generate different hashes for different inputs", () => {
            const hash1 = common.generateHashCode("input1");
            const hash2 = common.generateHashCode("input2");
            expect(hash1).to.not.equal(hash2);
        });
    });

    describe("checkUserId", () => {
        it("should generate and store a new user ID if one does not exist", async () => {
            const mockGlobalState = {
                getGlobalData: sandbox.stub().resolves(undefined),
                setGlobalData: sandbox.stub().resolves(undefined),
            };
            mockGlobalState.getGlobalData.onSecondCall().resolves({});
            globalStoreStub.getGlobalStateInstance.returns(mockGlobalState as any);
            await common.checkUserId();

            expect(mockGlobalState.getGlobalData.calledWith(Organization.debrickedDataKey, "", Organization.userId)).to
                .be.true;
            expect(mockGlobalState.setGlobalData.called).to.be.true;
            expect(loggerStub.logMessageByStatus.calledWith(MessageStatus.INFO, sinon.match(/New user_id generated:/)))
                .to.be.true;
            expect(globalStoreStub.setUserId.called).to.be.true;
        });

        it("should use existing user ID if one exists", async () => {
            const existingUserId = "existing-user-id";
            const mockGlobalState = {
                getGlobalData: sandbox.stub().resolves(existingUserId),
            };
            globalStoreStub.getGlobalStateInstance.returns(mockGlobalState as any);

            await common.checkUserId();

            expect(mockGlobalState.getGlobalData.calledWith(Organization.debrickedDataKey, "", Organization.userId)).to
                .be.true;
            expect(loggerStub.logMessageByStatus.calledWith(MessageStatus.INFO, `Existing user_id: ${existingUserId}`))
                .to.be.true;
            expect(globalStoreStub.setUserId.calledWith(existingUserId)).to.be.true;
        });
    });

    describe("replacePlaceholder", () => {
        it("should replace PLACEHOLDER with the given value", () => {
            const original = "Hello, PLACEHOLDER!";
            const replaced = common.replacePlaceholder(original, "World");
            expect(replaced).to.equal("Hello, World!");
        });

        it("should use current date if no placeholder value is provided", () => {
            const original = "Current time: PLACEHOLDER";
            const replaced = common.replacePlaceholder(original, "");
            expect(replaced).to.not.equal(original);
            expect(replaced).to.match(/Current time: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        });
    });

    describe("isCurrentDocManifestFile", () => {
        it("should return true for a manifest file", async () => {
            const mockDocument = { fileName: "/path/to/package.json" } as vscode.TextDocument;
            globalStoreStub.getRepository.returns("test-repo");
            globalStoreStub.getGlobalStateInstance.returns({
                getGlobalData: sandbox.stub().returns({ filesToScan: ["package.json"] }),
            } as any);

            const result = await common.isCurrentDocManifestFile(mockDocument);

            expect(result).to.deep.equal({ isManifestFile: true, currentManifestFile: "package.json" });
        });

        it("should return false for a non-manifest file", async () => {
            const mockDocument = { fileName: "/path/to/notmanifest.txt" } as vscode.TextDocument;
            globalStoreStub.getRepository.returns("test-repo");
            globalStoreStub.getGlobalStateInstance.returns({
                getGlobalData: sandbox.stub().returns({ filesToScan: ["package.json"] }),
            } as any);

            const result = await common.isCurrentDocManifestFile(mockDocument);

            expect(result).to.deep.equal({ isManifestFile: false, currentManifestFile: "notmanifest.txt" });
        });
    });

    describe("extractValueFromStringUsingRegex", () => {
        it("should extract a value using a regex", () => {
            const str = "The quick brown fox";
            const regex = /quick (\w+) fox/;
            const result = common.extractValueFromStringUsingRegex(str, regex);
            expect(result).to.equal("brown");
        });

        it("should return null if regex does not match", () => {
            const str = "The quick brown fox";
            const regex = /lazy (\w+) dog/;
            const result = common.extractValueFromStringUsingRegex(str, regex);
            expect(result).to.be.null;
        });

        it("should throw an error for invalid input", () => {
            expect(() => common.extractValueFromStringUsingRegex("", /test/)).to.throw("Invalid string");
            expect(() => common.extractValueFromStringUsingRegex("test", "not a regex" as any)).to.throw(
                "Invalid regular expression",
            );
        });
    });
});
