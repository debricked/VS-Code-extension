import * as path from "path";
import * as vscode from "vscode";
import * as os from "os";

export class Organization {
    static readonly name = "debricked";
    static readonly baseUrl = "https://debricked.com";
    static readonly apiVersion = "1.0";

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
    static readonly debrickedInstalledDir = path.join(__dirname, "../");
    static readonly reportsFolderPath = path.join(
        Organization.workspace,
        Organization.debrickedFolder,
        Organization.reports,
    );
    static readonly debrickedDataFile = "debricked_data.json";
    static readonly debrickedDataFilePath = path.join(
        Organization.debrickedInstalledDir,
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
    static readonly baseVersion = "0.0.0";
    static readonly extensionName = "vs-code-extension";
    static readonly debrickedCommand = "debrickedCommands";

    // Keys for storing data
    static readonly debrickedDataKey = "debrickedData";
    static readonly seqIdKey = "sequenceID";
    static readonly access = "access";
    static readonly accessTokenKey = "accessToken";
    static readonly repoDataKey = "repoData";
    static readonly bearer = "bearer";
    static readonly bearerTokenKey = "bearerToken";
    static readonly userId = "userId";

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
