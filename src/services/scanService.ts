import {
    statusBarMessageHelper,
    Logger,
    debrickedDataHelper,
    showInputBoxHelper,
    errorHandler,
    globalStore,
    commonHelper,
    commandHelper,
    authHelper,
} from "../helpers";
import { DebrickedCommands, MessageStatus, Organization, SecondService } from "../constants/index";
import { DebrickedCommandNode, Flag, RepositoryInfo } from "../types";
import * as vscode from "vscode";
import * as fs from "fs";
import { DependencyService } from "./dependencyService";
import { FileService } from "./fileService";

export class ScanService {
    static async scanService() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register ScanCommand");

            debrickedDataHelper.createDir(Organization.reportsFolderPath);
            globalStore.setSequenceID(commonHelper.generateHashCode());
            const cmdParams: string[] = [];
            const command: DebrickedCommandNode = DebrickedCommands.SCAN;

            cmdParams.push(command.cli_command);
            const selectedRepoName = globalStore.getRepository();
            const currentRepoData: RepositoryInfo = await globalStore
                .getGlobalStateInstance()
                ?.getGlobalData(selectedRepoName, {});
            Logger.logMessageByStatus(MessageStatus.INFO, `Current repository name: ${currentRepoData.repositoryName}`);

            if (currentRepoData?.repositoryName !== MessageStatus.UNKNOWN) {
                if (command.flags && command.global_flags && command.flags.length > 0) {
                    await ScanService.handleFlags(command.flags[1], cmdParams, currentRepoData);
                    await ScanService.handleFlags(command.flags[2], cmdParams, currentRepoData);
                    await ScanService.handleFlags(command.flags[3], cmdParams, currentRepoData);
                    await ScanService.handleFlags(command.flags[4], cmdParams, currentRepoData);
                }
            } else {
                Logger.logMessageByStatus(MessageStatus.WARN, `No default repo selected`);

                if (command.flags && command.global_flags && command.flags.length > 0) {
                    await ScanService.handleFlags(command.flags[0], cmdParams, currentRepoData);
                    await ScanService.handleFlags(command.flags[2], cmdParams, currentRepoData);
                    await ScanService.handleFlags(command.flags[3], cmdParams, currentRepoData);
                    await ScanService.handleFlags(command.flags[4], cmdParams, currentRepoData);
                    await ScanService.handleFlags(command.flags[5], cmdParams, currentRepoData);
                }
            }

            Logger.logMessageByStatus(MessageStatus.INFO, `Executing terminal command with parameters: ${cmdParams}`);
            vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Window,
                    title: Organization.nameCaps,
                    cancellable: false,
                },
                async (progress) => {
                    progress.report({ message: "Scanning Manifest Files🚀" });
                    const output = await commandHelper.executeAsyncCommand(
                        `${Organization.debrickedCli} ${cmdParams.join(" ")}`,
                        true,
                    );
                    if (!output.includes(SecondService.repositoryBaseUrl)) {
                        if (
                            DebrickedCommands.SCAN.flags &&
                            DebrickedCommands.SCAN.flags[2].report &&
                            fs.existsSync(DebrickedCommands.SCAN.flags[2].report)
                        ) {
                            await FileService.setRepoScannedData();

                            const repoId = await globalStore.getRepoId();
                            const commitId = await globalStore.getCommitId();

                            await DependencyService.getDependencyData(repoId, commitId);
                            await DependencyService.getVulnerableData();
                        } else {
                            throw new Error("No reports file exists");
                        }
                    }
                    statusBarMessageHelper.setStatusBarMessage(`Debricked: Scanning Completed $(pass-filled)`, 1000);
                },
            );
        } catch (error: any) {
            errorHandler.handleError(error);
        } finally {
            Logger.logMessageByStatus(MessageStatus.INFO, "Scan service finished.");
        }
    }

    static async handleFlags(selectedFlags: Flag, cmdParams: string[], currentRepoData: RepositoryInfo) {
        Logger.logMessageByStatus(MessageStatus.INFO, `Handling flag: ${selectedFlags.flag}(${selectedFlags.label})`);
        cmdParams.push(selectedFlags.flag);
        switch (selectedFlags.flag) {
            case "-r":
                const providedRepo = await showInputBoxHelper.promptForInput({
                    title: "Enter Repository name",
                    prompt: "Enter repository name",
                    ignoreFocusOut: false,
                });

                if (providedRepo) {
                    cmdParams.push(providedRepo);
                    Logger.logMessageByStatus(MessageStatus.INFO, `Selected repo: ${providedRepo}`);
                }
                break;

            case "-i":
                if (selectedFlags.flagValue) {
                    cmdParams.push(selectedFlags.flagValue);
                    Logger.logMessageByStatus(MessageStatus.INFO, `Flag value added: ${selectedFlags.flagValue}`);
                }
                break;

            case "-j":
                if (selectedFlags.report) {
                    cmdParams.push(selectedFlags.report);
                    Logger.logMessageByStatus(MessageStatus.INFO, `Report added: ${selectedFlags.report}`);
                }
                break;

            case "-a":
                const username = currentRepoData.userName;
                const email = currentRepoData.email;
                cmdParams.push(`"${username} (${email})"`);
                Logger.logMessageByStatus(MessageStatus.INFO, `User info added: ${username} (${email})`);
                break;

            case "-b":
                if (selectedFlags.flagValue) {
                    cmdParams.push(
                        commonHelper.replacePlaceholder(selectedFlags.flagValue, currentRepoData.currentBranch),
                    );
                    Logger.logInfo(`Branch info added: ${currentRepoData.currentBranch}`);
                }
                break;

            case "-c":
                if (selectedFlags.flagValue) {
                    const commitHash = currentRepoData.commitID;
                    cmdParams.push(commonHelper.replacePlaceholder(selectedFlags.flagValue, commitHash));
                    Logger.logMessageByStatus(MessageStatus.INFO, `Commit hash added: ${commitHash}`);
                }
                break;

            case "-t":
                const accessToken = await authHelper.getToken(true, Organization.access);
                if (accessToken) {
                    cmdParams.push(accessToken);
                    Logger.logMessageByStatus(MessageStatus.INFO, "Access token added");
                }
                break;
            default:
                Logger.logMessageByStatus(MessageStatus.WARN, `Unrecognized flag: ${selectedFlags.flag}`);
                break;
        }
    }
}
