import { sinon, expect } from "../setup";
import { AuthHelper } from "../../helpers";
import { Messages, Organization } from "../../constants";

describe("Auth Helper: Test Suite", () => {
    let sandbox: sinon.SinonSandbox;
    const fakeWorkspace = "/fake/workspace";

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(Organization, "workspace").value(fakeWorkspace);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should throw an error if workspace is not found", async () => {
        sandbox.stub(Organization, "workspace").value(undefined);

        await expect(AuthHelper.getAccessToken()).to.eventually.be.rejectedWith(Messages.WS_NOT_FOUND);
    });
});
