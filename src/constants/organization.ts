import * as path from "path";
import * as vscode from "vscode";
import * as os from "os";
import * as fs from "fs";
import { Environment } from "./enums";

export class Organization {
    static readonly debrickedRootDir = path.join(__dirname, "../");
    static readonly packageJson = JSON.parse(
        fs.readFileSync(`${Organization.debrickedRootDir}\package.json`).toString(),
    );

    static readonly name = Organization.packageJson.displayName;
    static readonly environment: Environment = (process.env.NODE_ENV?.trim() as Environment) ?? Environment.PROD;
    static readonly sentry_dns = "https://5427545a2216287c2e4e0fc546172a6a@sentry.debricked.com/20";
    static readonly nameCaps = "Debricked";
    // Command and OS-specific constants
    static readonly command = Organization.getPlatformSpecificCommand();
    static readonly osPlatform = os.platform();
    static readonly osWin32 = "win32";
    static readonly osLinux = "linux";
    static readonly osDarwin = "darwin";

    // Directory and file paths
    static readonly workspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || path.join(__dirname, "../../");
    static readonly debrickedFolder = `.${Organization.name}`;
    static readonly reports = "reports";
    static readonly logFile = "debricked.log";
    static readonly debrickedCli = path.join(__dirname, `../resources/debricked-cli/cli/${Organization.command}`);
    static readonly reportsFolderPath = path.join(
        Organization.workspace,
        Organization.debrickedFolder,
        Organization.reports,
    );

    static readonly debrickedDataFile = "debricked_data.json";
    static readonly debrickedDataFilePath = path.join(
        Organization.debrickedRootDir,
        Organization.debrickedFolder,
        Organization.debrickedDataFile,
    );
    static readonly debrickedInstaller = "resources/debricked-cli";

    // Installation scripts
    static readonly installBat = "install-debricked.bat";
    static readonly installSh = "install-debricked.sh";
    static readonly bash = "bash";

    // Extension constants
    static readonly extensionVersionKey = "extensionVersion";
    static readonly isFirstActivationKey = "isFirstActivation";
    static readonly debrickedCommand = "debrickedCommands";

    // Keys for storing data
    static readonly debrickedDataKey = "debrickedData";
    static readonly userId = "userId";

    // Markdown
    static readonly separator = "\n______________________________\n";

    // Messages
    static readonly UNSUPPORTED_OS = "Unsupported operating system";

    // Method to get platform-specific command
    private static getPlatformSpecificCommand(): string {
        return os.platform() === Organization.osWin32 ? "debricked.exe" : "debricked";
    }

    // Utility methods
    public static isWindows(): boolean {
        return Organization.osPlatform === Organization.osWin32;
    }

    public static isLinux(): boolean {
        return Organization.osPlatform === Organization.osLinux;
    }

    public static isMac(): boolean {
        return Organization.osPlatform === Organization.osDarwin;
    }
}
