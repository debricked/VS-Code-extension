import { DebrickedCommandNode, Flag } from "../types";
import { Organization } from "./organization";

export class DebrickedCommands {
    static readonly BASE_COMMAND: DebrickedCommandNode = {
        label: "Debricked",
        command: "debricked.debricked",
        cli_command: "debricked",
        description: "debricked-cli - Help about any command",
        sub_commands: [
            {
                label: "Install",
                command: "debricked.debricked.install",
                cli_command: "install",
                description: "Install Debricked-cli",
            },
            {
                label: "Add/Update Access Token",
                command: "debricked.debricked.access_token",
                cli_command: "access_token",
                description: "Add/Update Debricked access token",
            },
            {
                label: "Help",
                command: "debricked.debricked.help",
                cli_command: "help",
                description: "Help about any command",
            },
            {
                label: "Logs",
                command: "debricked.debricked.log",
                cli_command: "log",
                description: "Debricked logs",
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
        return [DebrickedCommands.BASE_COMMAND, DebrickedCommands.SCAN, DebrickedCommands.FILES];
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
