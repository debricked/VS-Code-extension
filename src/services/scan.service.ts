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
    debrickedServiceHelper,
    showQuickPickHelper,
} from "../helpers";
import {
    DebrickedCommands,
    Icons,
    Messages,
    MessageStatus,
    Organization,
    SecondService,
    Secrets,
} from "../constants/index";
import { DebrickedCommandNode, Flag, Repository, RepositoryInfo } from "../types";
import * as vscode from "vscode";
import * as fs from "fs";
import { PolicyRuleService } from "./policyRule.service";
import { DependencyService } from "./dependency.service";

export class ScanService {
    private readonly policyRuleService: PolicyRuleService;
    private readonly dependencyService: DependencyService;

    constructor(policyRuleService: PolicyRuleService, dependencyService: DependencyService) {
        this.policyRuleService = policyRuleService;
        this.dependencyService = dependencyService;
        this.handleFlags = this.handleFlags.bind(this);
        this.scan = this.scan.bind(this);
    }
    public async scan() {
        const isRunning = globalStore.getScanningProgress();

        if (isRunning) {
            statusBarMessageHelper.showWarningMessage(Messages.SCANNING_INPROGRESS);
            return;
        } else {
            globalStore.setScanningProgress(true);
        }

        try {
            if (!(await commonHelper.isCurrentRepoSupported())) {
                return;
            }

            Logger.logMessageByStatus(MessageStatus.INFO, "Register ScanCommand");

            debrickedDataHelper.createDir(Organization.reportsFolderPath);
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
                    await this.handleFlags(command.flags[1], cmdParams, currentRepoData);
                    await this.handleFlags(command.flags[2], cmdParams, currentRepoData);
                    await this.handleFlags(command.flags[3], cmdParams, currentRepoData);
                    await this.handleFlags(command.flags[4], cmdParams, currentRepoData);
                }
            } else {
                Logger.logMessageByStatus(MessageStatus.WARN, `No default repo selected`);

                if (command.flags && command.global_flags && command.flags.length > 0) {
                    await this.handleFlags(command.flags[0], cmdParams, currentRepoData);
                    await this.handleFlags(command.flags[2], cmdParams, currentRepoData);
                    await this.handleFlags(command.flags[3], cmdParams, currentRepoData);
                    await this.handleFlags(command.flags[4], cmdParams, currentRepoData);
                    await this.handleFlags(command.flags[5], cmdParams, currentRepoData);
                }
            }

            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Window,
                    title: Organization.nameCaps,
                    cancellable: false,
                },
                async (progress) => {
                    progress.report({ message: `${Icons.magnifier} Scanning Manifest Files` });
                    const output = await commandHelper.executeAsyncCommand(
                        `${Organization.debrickedCli} ${cmdParams.join(" ")}`,
                        true,
                    );
                    if (output.includes(SecondService.repositoryBaseUrl)) {
                        if (
                            DebrickedCommands.SCAN.flags &&
                            DebrickedCommands.SCAN.flags[2].report &&
                            fs.existsSync(DebrickedCommands.SCAN.flags[2].report)
                        ) {
                            await this.policyRuleService.setScannedData();

                            const repoId = await globalStore.getRepoId();
                            const commitId = await globalStore.getCommitId();

                            await this.dependencyService.getDependencyData(repoId, commitId);
                            await this.dependencyService.getVulnerableData();
                        } else {
                            throw new Error("No reports file exists");
                        }
                    }
                    statusBarMessageHelper.setStatusBarMessage(`Debricked: ${Icons.check} Scanning Completed`, 1000);
                },
            );
        } catch (error: any) {
            errorHandler.handleError(error);
        } finally {
            globalStore.setScanningProgress(false);
            Logger.logMessageByStatus(MessageStatus.INFO, "Scan service finished.");
        }
    }

    private async handleFlags(selectedFlags: Flag, cmdParams: string[], currentRepoData: RepositoryInfo) {
        Logger.logMessageByStatus(MessageStatus.INFO, `Handling flag: ${selectedFlags.flag}(${selectedFlags.label})`);
        cmdParams.push(selectedFlags.flag);
        switch (selectedFlags.flag) {
            case "-r": {
                const repoResponse: Repository[] = await debrickedServiceHelper.fetchRepositories();

                let providedRepo;
                if (repoResponse && repoResponse.length > 0) {
                    const repoData = repoResponse.map((item: Repository) => ({
                        label: item.name.name,
                        description: `Repository: ${item.name.name}, Repo ID: ${item.name.repoId}`,
                    }));

                    const selectedRepo = await showQuickPickHelper.showQuickPick(repoData, "Select Repository to Scan");
                    providedRepo = selectedRepo?.label;
                } else {
                    providedRepo = await showInputBoxHelper.promptForInput({
                        title: "Enter Repository name",
                        prompt: "Enter repository name",
                        ignoreFocusOut: false,
                    });
                }

                if (providedRepo) {
                    cmdParams.push(providedRepo);
                    Logger.logMessageByStatus(MessageStatus.INFO, `Selected repo: ${providedRepo}`);
                }
                break;
            }

            case "-i":
                if (selectedFlags.flagValue) {
                    cmdParams.push(selectedFlags.flagValue);
                    Logger.logMessageByStatus(MessageStatus.INFO, `Flag value added: ${selectedFlags.flagValue}`);
                }
                break;

            case "-j":
                if (selectedFlags.report) {
                    cmdParams.push(selectedFlags.report);
                    Logger.logMessageByStatus(MessageStatus.INFO, `Report added`);
                }
                break;

            case "-a": {
                const username = currentRepoData.userName;
                const email = currentRepoData.email;
                cmdParams.push(`"${username} (${email})"`);
                Logger.logMessageByStatus(MessageStatus.INFO, `User info added: ${username} (${email})`);
                break;
            }

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

            case "-t": {
                const accessToken = await authHelper.getToken(true, Secrets.ACCESS);
                if (accessToken) {
                    cmdParams.push(accessToken);
                    Logger.logMessageByStatus(MessageStatus.INFO, "Access token added");
                }
                break;
            }
            default:
                Logger.logMessageByStatus(MessageStatus.WARN, `Unrecognized flag: ${selectedFlags.flag}`);
                break;
        }
    }
}
