import { GlobalState } from "../../helpers/globalState";
import { expect, sinon } from "../setup";

describe("GlobalState", () => {
    let mockContext: sinon.SinonStubbedInstance<any>;
    let updateStub: sinon.SinonStub;
    let getStub: sinon.SinonStub;
    let keysStub: sinon.SinonStub;
    let storeStub: sinon.SinonStub;
    let secretsGetStub: sinon.SinonStub;
    let deleteStub: sinon.SinonStub;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        updateStub = sandbox.stub().resolves();
        getStub = sandbox.stub();
        keysStub = sandbox.stub();
        storeStub = sandbox.stub().resolves();
        secretsGetStub = sandbox.stub().resolves();
        deleteStub = sandbox.stub().resolves();

        mockContext = {
            globalState: {
                update: updateStub,
                get: getStub,
                keys: keysStub,
            },
            secrets: {
                store: storeStub,
                get: secretsGetStub,
                delete: deleteStub,
            },
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("getInstance", () => {
        it("should return the same instance when called multiple times", () => {
            const instance1 = GlobalState.getInstance(mockContext as any);
            const instance2 = GlobalState.getInstance(mockContext as any);
            expect(instance1).to.equal(instance2);
        });
    });
});
