import { Logger, SentryHelper } from "../../helpers";
import { expect, sinon } from "../setup";
import { Command } from "../../helpers/commandHelper";
import { GitHelper } from "../../helpers/gitHelper";
import { ShowInputBoxHelper } from "../../helpers/showInputBoxHelper";
import { GlobalStore } from "../../helpers/globalStore";
import { StatusBarMessageHelper } from "../../helpers/statusBarMessageHelper";
import { MessageStatus } from "../../constants";

describe("GitHelper", () => {
    let gitHelper: GitHelper;
    let commandStub: sinon.SinonStubbedInstance<Command>;
    let loggerStub: sinon.SinonStubbedInstance<typeof Logger>;
    let sentryHelperStub: sinon.SinonStubbedInstance<typeof SentryHelper>;
    let showInputBoxHelperStub: sinon.SinonStubbedInstance<ShowInputBoxHelper>;
    let globalStoreStub: sinon.SinonStubbedInstance<GlobalStore>;
    let statusBarMessageHelperStub: sinon.SinonStubbedInstance<StatusBarMessageHelper>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        commandStub = sandbox.createStubInstance(Command);
        loggerStub = {
            logError: sandbox.stub(),
            logMessageByStatus: sandbox.stub(),
        } as any;
        sentryHelperStub = {
            setUser: sandbox.stub(),
        } as any;
        showInputBoxHelperStub = sandbox.createStubInstance(ShowInputBoxHelper);
        globalStoreStub = sandbox.createStubInstance(GlobalStore);
        statusBarMessageHelperStub = sandbox.createStubInstance(StatusBarMessageHelper);

        gitHelper = new GitHelper(
            commandStub as any,
            loggerStub as any,
            sentryHelperStub as any,
            showInputBoxHelperStub as any,
            globalStoreStub as any,
            statusBarMessageHelperStub as any,
        );
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should return the current branch", async () => {
        commandStub.executeAsyncCommand.resolves("main");
        const result = await gitHelper.getCurrentBranch();
        expect(result).to.equal("main");
        expect(commandStub.executeAsyncCommand.firstCall.args[0]);
        expect(commandStub.executeAsyncCommand.calledWith("git branch --show-current")).to.be.true;
    });

    it("should return the commit hash", async () => {
        const hash = "1234567890abcdef";
        commandStub.executeAsyncCommand.resolves(hash);
        const result = await gitHelper.getCommitHash();
        expect(result).to.equal(hash);
        expect(commandStub.executeAsyncCommand.calledWith("git rev-parse HEAD")).to.be.true;
    });

    it("should return current timestamp if command fails", async () => {
        commandStub.executeAsyncCommand.resolves("");
        const result = await gitHelper.getCommitHash();
        expect(result).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it("should return the remote URL", async () => {
        const url = "https://github.com/user/repo.git";
        commandStub.executeAsyncCommand.resolves(url);
        const result = await gitHelper.getRemoteUrl();
        expect(result).to.equal(url);
        expect(commandStub.executeAsyncCommand.calledWith("git config --get remote.origin.url")).to.be.true;
    });

    it("should return the git status", async () => {
        await gitHelper.getStatus();
        expect(commandStub.executeAsyncCommand.calledWith("git status --short")).to.be.true;
    });

    it("should return the git log with default number of entries", async () => {
        const log = "commit1\ncommit2\ncommit3";
        commandStub.executeAsyncCommand.resolves(log);
        const result = await gitHelper.getLog();
        expect(result).to.equal(log);
        expect(commandStub.executeAsyncCommand.calledWith('git log -n 10 --pretty=format:"%h - %an, %ar : %s"')).to.be
            .true;
    });

    it("should return the git log with specified number of entries", async () => {
        const log = "commit1\ncommit2";
        commandStub.executeAsyncCommand.resolves(log);
        const result = await gitHelper.getLog(2);
        expect(result).to.equal(log);
        expect(commandStub.executeAsyncCommand.calledWith('git log -n 2 --pretty=format:"%h - %an, %ar : %s"')).to.be
            .true;
    });

    it("should return the git username if available", async () => {
        const username = "John Doe";
        commandStub.executeAsyncCommand.resolves(username);
        const result = await gitHelper.getUsername();
        expect(result).to.equal(username);
        expect(commandStub.executeAsyncCommand.calledWith("git config --get user.name")).to.be.true;
    });

    it("should prompt for username if not available", async () => {
        const username = "John Doe";
        commandStub.executeAsyncCommand.resolves("");
        showInputBoxHelperStub.promptForInput.resolves(username);
        const result = await gitHelper.getUsername();
        expect(result).to.equal(username);
        expect(showInputBoxHelperStub.promptForInput.calledOnce).to.be.true;
    });

    it("should return the git email if available", async () => {
        const email = "john@example.com";
        commandStub.executeAsyncCommand.resolves(email);
        const result = await gitHelper.getEmail();
        expect(result).to.equal(email);
        expect(commandStub.executeAsyncCommand.calledWith("git config --get user.email")).to.be.true;
    });

    it("should prompt for email if not available", async () => {
        const email = "john@example.com";
        commandStub.executeAsyncCommand.resolves("");
        showInputBoxHelperStub.promptForInput.resolves(email);
        const result = await gitHelper.getEmail();
        expect(result).to.equal(email);
        expect(showInputBoxHelperStub.promptForInput.calledOnce).to.be.true;
    });

    it("should return the upstream URL", async () => {
        const url = "https://github.com/user/repo.git";
        commandStub.executeAsyncCommand.resolves(url);
        const result = await gitHelper.getUpstream();
        expect(result).to.equal(url);
        expect(commandStub.executeAsyncCommand.calledWith("git remote get-url origin")).to.be.true;
    });

    describe("setupGit", () => {
        it("should set up git information", async () => {
            const repoName = "test-repo";
            const username = "John Doe";
            const email = "john@example.com";
            const branch = "main";
            const commitId = "1234567890abcdef";
            const userId = "user123";

            commandStub.executeAsyncCommand
                .withArgs("git remote get-url origin")
                .resolves(`https://github.com/user/${repoName}.git`);
            commandStub.executeAsyncCommand.withArgs("git config --get user.name").resolves(username);
            commandStub.executeAsyncCommand.withArgs("git config --get user.email").resolves(email);
            commandStub.executeAsyncCommand.withArgs("git branch --show-current").resolves(branch);
            commandStub.executeAsyncCommand.withArgs("git rev-parse HEAD").resolves(commitId);

            globalStoreStub.getUserId.returns(userId);
            const globalStateInstanceStub = {
                getGlobalData: sinon.stub().resolves({}),
                setGlobalData: sinon.stub().resolves(),
            };
            globalStoreStub.getGlobalStateInstance.returns(globalStateInstanceStub as any);

            await gitHelper.setupGit();

            expect(globalStoreStub.setRepository.calledWith(repoName)).to.be.true;
            expect(sentryHelperStub.setUser.calledWith({ id: userId, email, username })).to.be.true;
            expect(
                globalStateInstanceStub.setGlobalData.calledWith(repoName, {
                    repositoryName: repoName,
                    userName: username,
                    email,
                    currentBranch: branch,
                    commitID: commitId,
                }),
            ).to.be.true;
        });

        it("should handle unknown repository", async () => {
            commandStub.executeAsyncCommand.withArgs("git remote get-url origin").resolves(MessageStatus.UNKNOWN);

            await gitHelper.setupGit();

            expect(statusBarMessageHelperStub.showInformationMessage.calledWith("No repository selected")).to.be.true;
        });
    });
});
