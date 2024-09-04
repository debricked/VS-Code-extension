import { DebrickedCommandNode } from "../../types";
import { expect } from "../setup";

describe("DebrickedCommandNode interface", () => {
    it("should have required properties", () => {
        const node: DebrickedCommandNode = {
            label: "test-label",
            cli_command: "test-cli-command",
            command: "test-command",
            description: "test-description",
        };

        expect(node).to.have.property("label");
        expect(node).to.have.property("cli_command");
        expect(node).to.have.property("command");
        expect(node).to.have.property("description");
    });

    it("should allow optional properties", () => {
        const node: DebrickedCommandNode = {
            label: "test-label",
            cli_command: "test-cli-command",
            command: "test-command",
            description: "test-description",
            sub_commands: [],
            flags: [],
            global_flags: [],
            report: "test-report",
            isVisibleInTree: true,
        };

        expect(node).to.have.property("sub_commands");
        expect(node).to.have.property("flags");
        expect(node).to.have.property("global_flags");
        expect(node).to.have.property("report");
        expect(node).to.have.property("isVisibleInTree");
    });
});
