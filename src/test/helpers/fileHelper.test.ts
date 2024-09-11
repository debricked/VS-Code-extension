import { sinon, expect } from "../setup";
import { FileHelper } from "../../helpers/fileHelper";
import { DebrickedDataHelper } from "../../helpers/debrickedDataHelper";
import { Logger } from "../../helpers/loggerHelper";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { Organization } from "../../constants";

const dirPath = path.join(__dirname, "../../../.debricked/reports");
fs.mkdirSync(dirPath, { recursive: true });

describe("FileHelper", () => {
    let fileHelper: FileHelper;
    let debrickedDataHelperStub: sinon.SinonStubbedInstance<DebrickedDataHelper>;

    beforeEach(() => {
        debrickedDataHelperStub = sinon.createStubInstance(DebrickedDataHelper);
        fileHelper = new FileHelper(debrickedDataHelperStub, Logger);
    });

    describe("storeResultInFile", () => {
        it("should store content in a file", async () => {
            const fileName = "test-file.json";
            const content = '{ "key": "value" }';
            const filePath = await fileHelper.storeResultInFile(fileName, content);
            expect(filePath).to.equal(path.join(Organization.reportsFolderPath, fileName));
            expect(fs.readFileSync(filePath, "utf8")).to.equal(content);
        });
    });

    describe("openTextDocument", () => {
        it("should open a text document", async () => {
            const filePath = path.join(Organization.reportsFolderPath, "test-file.json");
            const showTextDocumentStub = sinon.stub(vscode.window, "showTextDocument");
            await fileHelper.openTextDocument(filePath);
            expect(showTextDocumentStub.calledOnce).to.be.true;
        });
    });

    describe("storeAndOpenFile", () => {
        it("should store content in a file and open it", async () => {
            const fileName = "test-file.json";
            const content = '{ "key": "value" }';
            const storeResultInFileStub = sinon.stub(fileHelper, "storeResultInFile");
            const openTextDocumentStub = sinon.stub(fileHelper, "openTextDocument");
            await fileHelper.storeAndOpenFile(fileName, content);
            expect(storeResultInFileStub.calledWith(fileName, content)).to.be.true;
            expect(openTextDocumentStub.calledOnce).to.be.true;
        });
    });

    describe("readFileSync", () => {
        it("should read a JSON file", () => {
            const filePath = "test-file.json";
            const fileContent = '{ "key": "value" }';
            fs.writeFileSync(filePath, fileContent);
            const result = fileHelper.readFileSync(filePath).toString();
            expect(result).to.equal(fileContent);
        });

        it("should throw an error if the file cannot be read", () => {
            const filePath = "non-existent-file.json";
            expect(() => fileHelper.readFileSync(filePath)).to.throw(Error);
        });
    });
});
