import { registerCommands } from "../../commands";
import { expect, context, sinon } from "../setup";

describe("Register Commands : Test Suite", () => {
    it("Register Commands", () => {
        let registerCommand = sinon.spy(registerCommands);
        registerCommand(context);
        expect(registerCommand).to.be.a("function");
    });
});
