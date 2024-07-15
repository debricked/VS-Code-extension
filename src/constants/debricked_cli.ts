import { DebrickedCommandNode, Flag } from "../types";
import * as vscode from "vscode";

export class DebrickedCommands {
    static readonly BASE_COMMAND: DebrickedCommandNode = {
        label: "Debricked",
        command: "debricked.debricked",
        cli_command: "",
        description: "debricked-cli",
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
            { label: "Author", flag: "-a", description: "commit author" },
            { label: "Branch", flag: "-b", description: "branch name" },
            {
                label: "Callgraph",
                flag: "--callgraph",
                description: "Enables call graph generation during scan.",
            },
            {
                label: "Callgraph Generate Timeout",
                flag: "--callgraph-generate-timeout",
                description: "Set a timeout (in seconds) on call graph generation. (default 3600)",
            },
            {
                label: "Callgraph Upload Timeout",
                flag: "--callgraph-upload-timeout",
                description: "Set a timeout (in seconds) on call graph upload. (default 600)",
            },
            { label: "Commit", flag: "-c", description: "commit hash" },
            {
                label: "Exclusion",
                flag: "-e",
                description:
                    'The following terms are supported to exclude paths:\nSpecial Terms | Meaning\n------------- | -------\n"*" | matches any sequence of non-Separator characters\n"/**/" | matches zero or multiple directories\n"?" | matches any single non-Separator character\n"[class]" | matches any single non-Separator character against a class of characters ([see "character classes"])\n"{alt1,...}" | matches a sequence of characters if one of the comma-separated alternatives matches\n\nExclude flags could alternatively be set using DEBRICKED_EXCLUSIONS="path1,path2,path3".\n\nExamples:\n$ debricked scan . -e "*\\**.lock" -e "**\\node_modules\\**" (default [**\\node_modules\\**,**\\vendor\\**,**\\.git\\**,**\\obj\\**,**\\bower_components\\**])',
            },
            {
                label: "Fingerprint",
                flag: "--fingerprint",
                description:
                    "enables fingerprinting for undeclared component identification. Can be run as a standalone command [files fingerprint] with more granular options. Will be default in an upcoming major release.",
            },
            { label: "Help", flag: "-h", description: "help for scan" },
            {
                label: "Integration",
                flag: "-i",
                description: 'name of integration used to trigger scan. For example "GitHub Actions" (default "CLI")',
            },
            {
                label: "JSON Path",
                flag: "-j",
                description: "write upload result as json to provided path",
                report: "scan-output.json",
            },
            {
                label: "Min Fingerprint Content Length",
                flag: "--min-fingerprint-content-length",
                description: "Set minimum content length (in bytes) for files to fingerprint.",
            },
            {
                label: "No Resolve",
                flag: "--no-resolve",
                description:
                    'disables resolution of manifest files that lack lock files. Resolving manifest files enables more accurate dependency scanning since the whole dependency tree will be analysed.\nFor example, if there is a "go.mod" in the target path, its dependencies are going to get resolved onto a lock file, and latter scanned.',
            },
            {
                label: "Pass on Timeout",
                flag: "-p",
                description: "pass scan if there is a service access timeout",
            },
            {
                label: "Prefer NPM",
                flag: "--prefer-npm",
                description:
                    "This flag allows you to select which package manager will be used as a resolver: Yarn (default) or NPM.\nExample: debricked resolve --prefer-npm",
            },
            {
                label: "Regenerate",
                flag: "--regenerate",
                description:
                    "Toggles regeneration of already existing lock files between 3 modes:\n\nForce Regeneration Level | Meaning\n------------------------ | -------\n0 (default) | No regeneration\n1 | Regenerates existing non package manager native Debricked lock files\n2 | Regenerates all existing lock files\n\nExample:\n$ debricked resolve . --regenerate=1",
            },
            {
                label: "Repository",
                flag: "-r, --repository",
                description: "repository name",
            },
            {
                label: "Repository URL",
                flag: "-u, --repository-url",
                description: "repository URL",
            },
            {
                label: "Verbose",
                flag: "--verbose",
                description:
                    "This flag allows you to reduce error output for resolution.\nExample:\n$ debricked resolve --verbose=false (default true)",
            },
            {
                label: "Version Hint",
                flag: "--version-hint",
                description:
                    "Toggles version hinting, i.e using manifest versions to help manifestless resolution.\n\nExample:\n$ debricked scan . --version-hint=false (default true)",
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

export class Organization {
    static readonly name = "debricked";
    static readonly debrickedFolder = `.${Organization.name}`;
    static readonly report = `${Organization.debrickedFolder}/reports`;
    static readonly log_file = "debricked.log";
    static readonly workspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
    static readonly debricked_cli = Organization.name;
    static readonly access_token_file = "token.json";
    static readonly debricked_data_file = "debricked_data.json";

    static getOrganizationInfo() {
        return {
            name: this.name,
            report: this.report,
            log_file: this.log_file,
            workspace: this.workspace,
            debricked_cli: this.debricked_cli,
            access_token_file: this.access_token_file,
            debricked_data_file: this.debricked_data_file,
        };
    }
}

export class ApiEndpoints {
    static readonly BASE_URL = "https://staging.debricked.com";

    static getBaseUrl() {
        return this.BASE_URL;
    }
}
