import { sinon, expect } from "../setup";
import * as vscode from "vscode";
import { DebrickedCommands } from "../../constants";

describe("Debricked CLI: Test Suite", () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(vscode.workspace, "workspaceFolders").value([{ uri: { fsPath: "/fake/path" } }]);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("DebrickedCommands", () => {
        it("should return all commands", () => {
            const commands = DebrickedCommands.getAllCommands();
            expect(commands).to.be.an("array");
            expect(commands).to.have.lengthOf(3);
            expect(commands[0]).to.have.property("label", "Debricked");
            expect(commands[1]).to.have.property("label", "Scan");
        });

        it("should get a specific command", () => {
            const command = DebrickedCommands.getCommand("scan");
            expect(command).to.not.be.undefined;
            expect(command).to.have.property("label", "Scan");
        });

        it("should return undefined for an unknown command", () => {
            const command = DebrickedCommands.getCommand("unknown");
            expect(command).to.be.undefined;
        });

        /*
         *  Uncomment when we have commands which have subcommands
         */

        // it("should get a specific sub-command", () => {
        //     const subCommand = DebrickedCommands.getSubCommand("license");
        //     expect(subCommand).to.not.be.undefined;
        //     expect(subCommand).to.have.property("label", "License");
        // });

        it("should return undefined for an unknown sub-command", () => {
            const subCommand = DebrickedCommands.getSubCommand("unknown");
            expect(subCommand).to.be.undefined;
        });

        it("should get command-specific flags", () => {
            const flags = DebrickedCommands.getCommandSpecificFlags("scan");
            expect(flags).to.be.an("array");
            expect(flags).to.have.length.greaterThan(0);
        });

        it("should return undefined for a command without flags", () => {
            const flags = DebrickedCommands.getCommandSpecificFlags("help");
            expect(flags).to.be.undefined;
        });
    });
});
