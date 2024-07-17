import path from "path";
import { DebrickedCommandNode, Flag } from "../types";
import * as vscode from "vscode";

export class Organization {
    static readonly name = "debricked";
    static readonly debrickedFolder = `.${Organization.name}`;
    static readonly reports = "reports";
    static readonly log_file = "debricked.log";
    static readonly workspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || path.join(__dirname, "../../");
    static readonly debricked_cli = Organization.name;
    static readonly debricked_installed_dir = path.join(__dirname, "../");
    static readonly reportsFolderPath = path.join(
        Organization.workspace,
        Organization.debrickedFolder,
        Organization.reports,
    );
    static readonly debricked_data_file = "debricked_data.json";
    static readonly debricked_installer = "resources/debricked-cli";
    static readonly EXTENSION_VERSION_KEY = "extensionVersion";
    static readonly IS_FIRST_ACTIVATION_KEY = "isFirstActivation";
    static readonly base_version = "0.0.0";
    static readonly extension_name = "vs-code-extension";
    static readonly debricked_command = "debrickedCommands";
    static readonly install_bat = "install-debricked.bat";
    static readonly install_sh = "install-debricked.sh";
    static readonly bash = "bash";
    static readonly os_win32 = "win32";
    static readonly os_linux = "linux";
    static readonly os_darwin = "darwin";

    static getOrganizationInfo() {
        return {
            name: this.name,
            reports: this.reports,
            log_file: this.log_file,
            workspace: this.workspace,
            debricked_cli: this.debricked_cli,
            debricked_data_file: this.debricked_data_file,
        };
    }
}

export class DebrickedCommands {
    static readonly BASE_COMMAND: DebrickedCommandNode = {
        label: "Debricked",
        command: "debricked.debricked",
        cli_command: "",
        description: "debricked-cli",
        sub_commands: [
            {
                label: "Install",
                command: "debricked.debricked.install",
                cli_command: "install",
                description: "Install Debricked-cli",
            },
        ],
        flags: [
            {
                label: "Access Token",
                flag: "-t",
                description:
                    "Debricked access token. Read more: https://portal.debricked.com/administration-47/how-do-i-generate-an-access-token-130",
            },
            {
                label: "Help",
                flag: "-h",
                description: "help for debricked",
            },
            {
                label: "Version",
                flag: "-v",
                description: "version for debricked",
            },
        ],
    };

    static readonly CALLGRAPH: DebrickedCommandNode = {
        label: "Callgraph",
        command: "debricked.callgraph",
        cli_command: "callgraph",
        description: "Generate a static call graph for the given directory and subdirectories",
    };

    static readonly FILES: DebrickedCommandNode = {
        label: "Files",
        command: "debricked.files",
        cli_command: "files",
        description: "Analyze files",
        report: "files",
        sub_commands: [
            {
                label: "Find",
                command: "debricked.files.find",
                cli_command: "find",
                description: "Find all dependency files in inputted path",
                flags: [
                    {
                        label: "Exclusion",
                        flag: "-e",
                        description:
                            'The following terms are supported to exclude paths:\nSpecial Terms | Meaning\n------------- | -------\n"*" | matches any sequence of non-Separator characters\n"/**/" | matches zero or multiple directories\n"?" | matches any single non-Separator character\n"[class]" | matches any single non-Separator character against a class of characters ([see "character classes"])\n"{alt1,...}" | matches a sequence of characters if one of the comma-separated alternatives matches\n\nExclude flags could alternatively be set using DEBRICKED_EXCLUSIONS="path1,path2,path3".\n\nExample:\n$ debricked files find . -e "*\\**.lock" -e "**\\node_modules\\**" (default [**\\node_modules\\**,**\\vendor\\**,**\\.git\\**,**\\obj\\**,**\\bower_components\\**])',
                    },
                    {
                        label: "Help",
                        flag: "-h",
                        description: "help for find",
                    },
                    {
                        label: "JSON",
                        flag: "-j",
                        description:
                            'Print files in JSON format\nFormat:\n[\n{\n"manifestFile": "package.json",\n"lockFiles": [\n"yarn.lock"\n]\n}]',
                    },
                    {
                        label: "Lockfile",
                        flag: "-l",
                        description: "If set, only lock files are found",
                    },
                    {
                        label: "Strict",
                        flag: "-s",
                        description:
                            "Allows to control which files will be matched:\nStrictness Level | Meaning\n---------------- | -------\n0 (default) | Returns all matched manifest and lock files regardless if they're paired or not\n1 | Returns only lock files and pairs of manifest and lock file\n2 | Returns only pairs of manifest and lock file",
                    },
                ],
            },
        ],
        flags: [
            {
                label: "Help",
                flag: "-h",
                description: "help for find",
            },
        ],
        global_flags: [
            {
                label: "Access Token",
                flag: "-t",
                description:
                    "Debricked access token.\nRead more: https://portal.debricked.com/administration-47/how-do-i-generate-an-access-token-130",
            },
        ],
    };

    static readonly FINGERPRINT: DebrickedCommandNode = {
        label: "Fingerprint",
        command: "debricked.fingerprint",
        cli_command: "fingerprint",
        description: "Fingerprints files to match against the Debricked knowledge base.",
    };

    static readonly HELP: DebrickedCommandNode = {
        label: "Help",
        command: "debricked.help",
        cli_command: "help",
        description: "Help about any command",
    };

    static readonly REPORT: DebrickedCommandNode = {
        label: "Report",
        command: "debricked.report",
        cli_command: "report",
        description: "Generate reports",
        report: "report",
        sub_commands: [
            {
                label: "License",
                command: "debricked.report.license",
                cli_command: "license",
                description: "Generate license report",
                flags: [
                    {
                        label: "Help",
                        flag: "-h",
                        description: "help for license",
                    },
                    { label: "Commit", flag: "-c", description: "commit hash" },
                    {
                        label: "Email",
                        flag: "-e",
                        description: "The email address that the report will be sent to",
                    },
                ],
            },
            {
                label: "Vulnerability",
                command: "debricked.report.vulnerability",
                cli_command: "vulnerability",
                description: "Generate vulnerability report",
                flags: [
                    {
                        label: "Help",
                        flag: "-h",
                        description: "help for vulnerability",
                    },
                    {
                        label: "Email",
                        flag: "-e",
                        description: "The email address that the report will be sent to",
                    },
                ],
            },
        ],
        global_flags: [
            {
                label: "Access token",
                flag: "-t",
                description:
                    "Debricked access token. Read more: https://portal.debricked.com/administration-47/how-do-i-generate-an-access-token-130",
            },
        ],
    };

    static readonly RESOLVE: DebrickedCommandNode = {
        label: "Resolve",
        command: "debricked.resolve",
        cli_command: "resolve",
        description: "Resolve manifest files",
        report: "resolve",
    };

    static readonly SCAN: DebrickedCommandNode = {
        label: "Scan",
        command: "debricked.scan",
        cli_command: "scan",
        description: "Start a Debricked dependency scan",
        report: "scan",
        flags: [
            {
                label: "Repository",
                flag: "-r",
                description: "repository name",
            },
            {
                label: "Integration",
                flag: "-i",
                description: 'name of integration used to trigger scan. For example "GitHub Actions" (default "CLI")',
                flagValue: "ide-vscode",
            },
            {
                label: "JSON Path",
                flag: "-j",
                description: "write upload result as json to provided path",
                report: `${Organization.debrickedFolder}/${Organization.reports}/scan-output.json`,
            },
            { label: "Author", flag: "-a", description: "commit author" },
            { label: "Branch", flag: "-b", description: "branch name", flagValue: "ide-PLACEHOLDER" },
            {
                label: "Commit",
                flag: "-c",
                description: "commit hash",
                flagValue: `PLACEHOLDER-${new Date().toISOString()}`,
            },
        ],
        global_flags: [
            {
                label: "Access Token",
                flag: "-t",
                description:
                    "Debricked access token.\nRead more: https://portal.debricked.com/administration-47/how-do-i-generate-an-access-token-130",
            },
        ],
    };

    static getAllCommands(): DebrickedCommandNode[] {
        return [DebrickedCommands.BASE_COMMAND, DebrickedCommands.HELP, DebrickedCommands.SCAN];
    }

    static getCommand(commandName: string): DebrickedCommandNode | undefined {
        const allCommands = this.getAllCommands();
        for (const command of allCommands) {
            if (command.label.toLowerCase() === commandName.toLowerCase()) {
                return command;
            }
        }
        return undefined;
    }

    static getSubCommand(commandName: string): DebrickedCommandNode | undefined {
        const allCommands = this.getAllCommands();
        for (const command of allCommands) {
            if (command.sub_commands) {
                for (const subCommand of command.sub_commands) {
                    if (subCommand.label.toLowerCase() === commandName.toLowerCase()) {
                        return subCommand;
                    }
                }
            }
        }
        return undefined;
    }

    static getCommandSpecificFlags(commandName: string): Flag[] | undefined {
        const command = this.getCommand(commandName);
        return command?.flags || undefined;
    }
}

export class ApiEndpoints {
    static readonly BASE_URL = "https://staging.debricked.com";

    static getBaseUrl() {
        return this.BASE_URL;
    }
}
