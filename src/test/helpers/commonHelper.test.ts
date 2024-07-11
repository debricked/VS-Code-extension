import { Common } from "../../helpers";
import { expect, sinon } from "../setup";

describe("Common Helper : Test Suite", () => {
    it("Check User Id", () => {
        const checkUserId = sinon.spy(Common, "checkUserId");
        checkUserId();
        expect(checkUserId).to.be.a("function");
    });
});
