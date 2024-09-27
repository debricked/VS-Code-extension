import {
    statusBarMessageHelper,
    Logger,
    showQuickPickHelper,
    commandHelper,
    errorHandler,
    globalStore,
    commonHelper,
    fileHelper,
    SentryHelper,
} from "../helpers";
import { DebrickedCommands, Icons, Messages, MessageStatus, Organization, Regex } from "../constants/index";
import { Package } from "../types";
import * as vscode from "vscode";

export class FileService {
    constructor() {
        this.filesService = this.filesService.bind(this);
        this.findFilesService = this.findFilesService.bind(this);
        this.getFilesToScan = this.getFilesToScan.bind(this);
        this.processPackages = this.processPackages.bind(this);
        this.setRepoScannedData = this.setRepoScannedData.bind(this);
    }
    public async filesService() {
        try {
            Logger.logMessageByStatus(MessageStatus.INFO, "Register FileCommand");

            const command = DebrickedCommands.FILES;

            if (!command.sub_commands || command.sub_commands.length === 0) {
                statusBarMessageHelper.showInformationMessage("No sub-commands available for Files service");
                return;
            }
            const selectedSubCommand = await showQuickPickHelper.showQuickPick(
                command.sub_commands,
                Messages.QUICK_PICK_SUB_COMMAND,
            );

            if (!selectedSubCommand) {
                throw new Error("No option has been selected when running files command");
            }

            switch (selectedSubCommand.cli_command) {
                case "find":
                    await this.findFilesService();
                    break;
                default:
                    throw new Error(`Unsupported sub-command: ${selectedSubCommand.cli_command}`);
            }
        } catch (error: any) {
            errorHandler.handleError(error);
        }
    }

    public async findFilesService(): Promise<string[] | undefined> {
        return vscode.window.withProgress<string[] | undefined>(
            {
                location: vscode.ProgressLocation.Window,
                title: Organization.nameCaps,
                cancellable: false,
            },
            async (progress) => {
                try {
                    Logger.logMessageByStatus(MessageStatus.INFO, "Register Find File Command");

                    const command = DebrickedCommands.FILES;
                    const cmdParams = [command.cli_command];

                    if (command.sub_commands && command.sub_commands.length > 0) {
                        const selectedSubCommand = command.sub_commands[0];
                        if (selectedSubCommand && selectedSubCommand.cli_command) {
                            cmdParams.push(selectedSubCommand.cli_command, "-j");
                        }
                    }

                    progress.report({ message: `${Icons.rocket} Finding Files...` });

                    const foundFiles = JSON.parse(
                        await commandHelper.executeAsyncCommand(`${Organization.debrickedCli} ${cmdParams.join(" ")}`),
                    );

                    const foundFilesArray = foundFiles
                        .map((item: any) => item.manifestFile)
                        .filter((file: any) => file !== "");

                    const selectedRepoName = globalStore.getRepository();
                    let repoData: any = await globalStore.getGlobalStateInstance()?.getGlobalData(selectedRepoName, {});

                    if (!repoData) {
                        repoData = {};
                    }

                    repoData.filesToScan = foundFilesArray;
                    progress.report({ message: `${Icons.check} Found Files` });

                    await globalStore.getGlobalStateInstance()?.setGlobalData(selectedRepoName, repoData);

                    Logger.logMessageByStatus(
                        MessageStatus.INFO,
                        `Found ${foundFilesArray.length} Files: ${foundFilesArray}`,
                    );

                    return foundFilesArray;
                } catch (error) {
                    const errorObj = new Error("Error in finding manifest files");
                    SentryHelper.captureException(errorObj);
                    throw errorObj;
                } finally {
                    Logger.logMessageByStatus(MessageStatus.INFO, "Files service finished.");
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            },
        );
    }

    public async getFilesToScan() {
        const debrickedData: any = await globalStore
            .getGlobalStateInstance()
            ?.getGlobalData(Organization.debrickedDataKey, {});
        const repositoryName = globalStore.getRepository();
        if (repositoryName) {
            return debrickedData[repositoryName]?.filesToScan;
        } else {
            return debrickedData["unknown"].filesToScan;
        }
    }

    public async setRepoScannedData() {
        const scannedFilePath = DebrickedCommands.SCAN.flags ? DebrickedCommands.SCAN.flags[2].report : "";
        let data;
        if (scannedFilePath) {
            data = JSON.parse(fileHelper.readFileSync(scannedFilePath).toString());
        }
        const url = data.detailsUrl;

        const repoId = Number(commonHelper.extractValueFromStringUsingRegex(url, Regex.repoId));
        const commitId = Number(commonHelper.extractValueFromStringUsingRegex(url, Regex.commitId));

        repoId ? globalStore.setRepoId(repoId) : null;
        commitId ? globalStore.setCommitId(commitId) : null;

        this.processPackages(data.automationRules);
        Logger.logInfo("Found the repoId and commitId");
    }

    public processPackages(automationRules: any[]) {
        const actions = ["warnPipeline", "failPipeline"];

        const triggerEventsMap = automationRules
            .filter((rule) => actions.some((action) => rule.ruleActions.includes(action)))
            .flatMap((rule) =>
                rule.triggerEvents.map((event: any) => {
                    const { dependency, ...restOfEvent } = event;
                    const { ruleActions, ruleLink } = rule;
                    return {
                        ...restOfEvent,
                        dependencyName: dependency.split(" ")[0],
                        policyRules: [{ ruleActions, ruleLink }],
                    };
                }),
            )
            .reduce((map, event) => {
                // for storing the multiple rules
                const existingPackage = map.get(event.dependencyName);
                if (existingPackage) {
                    const existingPolicyRules = existingPackage.policyRules || [];
                    const newPolicyRule = event.policyRules[0];

                    if (!existingPolicyRules.some((rule: any) => rule.ruleLink === newPolicyRule.ruleLink)) {
                        existingPackage.policyRules = [...existingPolicyRules, newPolicyRule];
                    }
                } else {
                    map.set(event.dependencyName, event);
                }

                return map;
            }, new Map<string, Package>());

        globalStore.setPackages(triggerEventsMap);
    }
}
