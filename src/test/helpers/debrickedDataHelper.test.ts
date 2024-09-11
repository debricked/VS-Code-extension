import { expect } from "../setup";
import { DebrickedDataHelper } from "../../helpers/debrickedDataHelper";
import * as fs from "fs";

describe("DebrickedDataHelper", () => {
    let debrickedDataHelper: DebrickedDataHelper;

    beforeEach(() => {
        debrickedDataHelper = new DebrickedDataHelper();
    });

    describe("createDir", () => {
        it("should create a directory with the specified path", () => {
            const dirPath = "test-dir";
            debrickedDataHelper.createDir(dirPath);
            expect(fs.existsSync(dirPath)).to.be.true;
            fs.rmdirSync(dirPath);
        });

        it("should not throw an error if the directory already exists", () => {
            const dirPath = "test-dir";
            fs.mkdirSync(dirPath);
            expect(() => debrickedDataHelper.createDir(dirPath)).not.to.throw();
            fs.rmdirSync(dirPath);
        });
    });
});
