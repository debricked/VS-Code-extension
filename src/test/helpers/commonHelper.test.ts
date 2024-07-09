import sinon from "sinon";
import { Common } from "../../helpers";

describe("Common Helper : Test Suite", () => {
    let expect: any;

    before(async () => {
        const chai = await import("chai");
        chai.should();
        expect = chai.expect;
    });

    it("Check User Id", () => {
        let checkUserId = sinon.spy(Common, "checkUserId");
        checkUserId();
        expect(checkUserId).to.be.a("function");
    });
});
