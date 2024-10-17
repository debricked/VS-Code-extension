import { DebrickedCommands } from "../../constants/index";
import { DebrickedCommandsTreeDataProvider } from "../../providers";
import { DebrickedCommandNode } from "../../types";
import { expect, sinon } from "../setup";

describe("DebrickedCommandsTreeDataProvider Test Suite", () => {
    let treeDataProvider: DebrickedCommandsTreeDataProvider;
    let sandbox: sinon.SinonSandbox;

    const mockCommands: DebrickedCommandNode[] = [
        {
            label: "Debricked : A fast and flexible software composition analysis CLI tool, given to you by Debricked.",
            cli_command: "",
            command: "debricked.debricked",
            description: "A fast and flexible software composition analysis CLI tool, given to you by Debricked.",
        },
        {
            label: "Help about any command",
            cli_command: "",
            command: "debricked.help",
            description: "Help about any command.",
        },
        {
            label: "Start a Debricked dependency scan",
            cli_command: "",
            command: "debricked.scan",
            description: "Start a Debricked dependency scan.",
        },
    ];

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(DebrickedCommands, "getAllCommands").returns(mockCommands);
        treeDataProvider = new DebrickedCommandsTreeDataProvider();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should get all commands when no element is passed to getChildren", async () => {
        const children = await treeDataProvider.getChildren();
        expect(children).to.deep.equal(mockCommands);
    });

    it("should get subcommands when element with sub_commands is passed to getChildren", async () => {
        const element = {
            label: "Parent Command",
            cli_command: "",
            command: "",
            description: "",
            sub_commands: mockCommands,
        };
        const children = await treeDataProvider.getChildren(element);
        expect(children).to.deep.equal(mockCommands);
    });

    it("should return an empty array when element with no sub_commands is passed to getChildren", async () => {
        const element = {
            label: "Single Command",
            cli_command: "",
            command: "",
            description: "",
        };
        const children = await treeDataProvider.getChildren(element);
        expect(children).to.deep.equal([]);
    });

    it("should create a TreeItem with correct properties when command is present", () => {
        const element = {
            label: "Debricked : A fast and flexible software composition analysis CLI tool, given to you by Debricked.",
            command: "debricked.debricked",
            cli_command: "",
            description: "A fast and flexible software composition analysis CLI tool, given to you by Debricked.",
        };
        const treeItem = treeDataProvider.getTreeItem(element);
        expect(treeItem.label).to.equal(element.label);
        expect(treeItem.command).to.deep.equal({
            command: element.command,
            title: element.label,
        });
        expect(treeItem.tooltip).to.equal(element.description);
        expect(treeItem.contextValue).to.equal("command");
    });

    it("should create a TreeItem with correct properties when command is not present", () => {
        const element = {
            label: "Single Command",
            description: "A single command.",
            cli_command: "",
            command: "",
        };
        const treeItem = treeDataProvider.getTreeItem(element);
        expect(treeItem.label).to.equal(element.label);
        expect(treeItem.tooltip).to.equal(element.description);
        expect(treeItem.command).to.be.undefined;
        expect(treeItem.contextValue).to.be.undefined;
    });

    it("should refresh tree data", () => {
        const fireSpy = sinon.spy(treeDataProvider["_onDidChangeTreeData"], "fire");
        treeDataProvider.refresh();
        expect(fireSpy.calledOnce).to.be.true;
    });
});
