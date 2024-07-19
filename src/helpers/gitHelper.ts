import { MessageStatus } from "../constants/index";
import { Command, Common, Logger } from "../helpers";
import * as vscode from "vscode";

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

    public static async getUpstream(): Promise<string> {
        return await Command.executeAsyncCommand("git remote get-url origin");
    }

    public static async getRepositoryName(): Promise<string> {
        return await Command.executeAsyncCommand("git rev-parse --show-toplevel").then((repoPath) => {
            return repoPath.split("/").pop() || repoPath.split("\\").pop() || "";
        });
    }

    public static async setupGit(): Promise<void> {
        const currentRepo = await GitHelper.getUpstream();
        Logger.logMessageByStatus(MessageStatus.INFO, `Current repository: ${currentRepo}`);
        let userName: string | undefined;
        let email: string | undefined;
        let debrickedData: any = await Common.readDataFromDebrickedJSON();
        debrickedData = JSON.parse(debrickedData);
        let selectedRepoName: string;

        if (currentRepo.indexOf(".git") > -1) {
            selectedRepoName = await GitHelper.getRepositoryName();
        } else {
            selectedRepoName = "unknown";
        }

        if (selectedRepoName) {
            if (!debrickedData[selectedRepoName]) {
                debrickedData[selectedRepoName] = {};
            }
        }

        userName = await GitHelper.getUsername();
        if (!userName) {
            userName = await vscode.window.showInputBox({
                prompt: "Enter User Name",
                ignoreFocusOut: false,
            });
        } else {
            debrickedData[selectedRepoName].userName = userName;
        }

        email = await GitHelper.getEmail();
        if (!email) {
            email = await vscode.window.showInputBox({
                prompt: "Enter Email Name",
                ignoreFocusOut: false,
            });
        } else {
            debrickedData[selectedRepoName].email = email;
        }

        await Common.writeDataToDebrickedJSON(debrickedData);
    }
}
