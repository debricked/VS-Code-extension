import { Command } from "../helpers";

export class GitHelper {
    public static async getCurrentBranch() {
        return await Command.executeAsyncCommand("git branch --show-current");
    }

    public static async getCommitHash(): Promise<string> {
        return await Command.executeAsyncCommand("git rev-parse HEAD");
    }

    public static async getRemoteUrl(): Promise<string> {
        return await Command.executeAsyncCommand("git config --get remote.origin.url");
    }

    public static async getStatus(): Promise<string> {
        return await Command.executeAsyncCommand("git status --short");
    }

    public static async getLog(n: number = 10): Promise<string> {
        return await Command.executeAsyncCommand(`git log -n ${n} --pretty=format:"%h - %an, %ar : %s"`);
    }

    public static async getUsername(): Promise<string> {
        return await Command.executeAsyncCommand("git config --get user.name");
    }

    public static async getEmail(): Promise<string> {
        return await Command.executeAsyncCommand("git config --get user.email");
    }

    public static async getRepositoryName(): Promise<string> {
        return await Command.executeAsyncCommand("git rev-parse --show-toplevel").then((repoPath) => {
            return repoPath.split("/").pop() || repoPath.split("\\").pop() || "";
        });
    }
}
