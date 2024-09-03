import { expect } from "../setup";
import { DebrickedCommands } from "../../constants"; // Adjust the import path as needed

describe("DebrickedCommands", () => {
    describe("getAllCommands", () => {
        it("should return an array of DebrickedCommandNode objects", () => {
            const allCommands = DebrickedCommands.getAllCommands();
            expect(allCommands).to.be.an("array");
            expect(allCommands).to.have.lengthOf(3);
            allCommands.forEach((command) => {
                expect(command).to.have.property("label");
                expect(command).to.have.property("command");
                expect(command).to.have.property("cli_command");
                expect(command).to.have.property("description");
            });
        });
    });

    describe("getCommand", () => {
        it("should return the correct command for a given name", () => {
            const scanCommand = DebrickedCommands.getCommand("scan");
            expect(scanCommand).to.not.be.undefined;
            expect(scanCommand?.label).to.equal("Scan");
            expect(scanCommand?.cli_command).to.equal("scan");
        });

        it("should return undefined for a non-existent command", () => {
            const nonExistentCommand = DebrickedCommands.getCommand("nonexistent");
            expect(nonExistentCommand).to.be.undefined;
        });

        it("should be case-insensitive", () => {
            const filesCommand = DebrickedCommands.getCommand("FiLeS");
            expect(filesCommand).to.not.be.undefined;
            expect(filesCommand?.label).to.equal("Files");
        });
    });

    describe("getSubCommand", () => {
        it("should return the correct sub-command for a given name", () => {
            const findSubCommand = DebrickedCommands.getSubCommand("find");
            expect(findSubCommand).to.not.be.undefined;
            expect(findSubCommand?.label).to.equal("Find");
            expect(findSubCommand?.cli_command).to.equal("find");
        });

        it("should return undefined for a non-existent sub-command", () => {
            const nonExistentSubCommand = DebrickedCommands.getSubCommand("nonexistent");
            expect(nonExistentSubCommand).to.be.undefined;
        });
    });

    describe("getCommandSpecificFlags", () => {
        it("should return the correct flags for a given command", () => {
            const scanFlags = DebrickedCommands.getCommandSpecificFlags("scan");
            expect(scanFlags).to.not.be.undefined;
            expect(scanFlags).to.be.an("array");
            expect(scanFlags).to.have.lengthOf(6);
            scanFlags?.forEach((flag) => {
                expect(flag).to.have.property("label");
                expect(flag).to.have.property("flag");
                expect(flag).to.have.property("description");
            });
        });

        it("should return undefined for a command without specific flags", () => {
            const noFlags = DebrickedCommands.getCommandSpecificFlags("test");
            expect(noFlags).to.be.undefined;
        });
    });
});
