import { expect } from "../setup";
import { StatusMessage } from "../../helpers";
import { MessageStatus } from "../../constants";

describe("StatusMessage", () => {
    it("should return the correct message for START status", () => {
        const result = StatusMessage.getStatusMessage(MessageStatus.START, "TestCommand");
        expect(result).to.equal("Debricked - TestCommand started.");
    });

    it("should return the correct message for COMPLETE status", () => {
        const result = StatusMessage.getStatusMessage(MessageStatus.COMPLETE, "TestCommand");
        expect(result).to.equal("Debricked - TestCommand completed.");
    });

    it("should return the correct message for ERROR status", () => {
        const result = StatusMessage.getStatusMessage(MessageStatus.ERROR, "TestCommand");
        expect(result).to.equal("Debricked - TestCommand encountered an error.");
    });

    it("should return the correct message for FINISHED status", () => {
        const result = StatusMessage.getStatusMessage(MessageStatus.FINISHED, "TestCommand");
        expect(result).to.equal("Debricked - TestCommand finished.");
    });

    it("should return the correct message for unknown status", () => {
        const result = StatusMessage.getStatusMessage("UNKNOWN_STATUS", "TestCommand");
        expect(result).to.equal("Debricked - TestCommand unknown status.");
    });
});
