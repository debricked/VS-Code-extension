import { Common } from "../../helpers";
import { expect, sinon } from "../setup";

describe("Common Helper : Test Suite", () => {
    it("Check User Id", () => {
        let checkUserId = sinon.spy(Common, "checkUserId");
        checkUserId();
        expect(checkUserId).to.be.a("function");
    });
});
