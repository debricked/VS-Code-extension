import { setSeqToken, getSeqToken } from "../../helpers";
import { expect } from "../setup";

describe("SeqToken Module", () => {
    const testHashCode = "testHashCode";

    it("should set and get the seqToken correctly", () => {
        setSeqToken(testHashCode);
        const result = getSeqToken();
        expect(result).to.equal(testHashCode);
    });

    it("should return undefined if seqToken is not set", () => {
        expect(getSeqToken()).to.equal("testHashCode");
    });
});
