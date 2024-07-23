import path from "path";
import * as vscode from "vscode";
import os from "os";

export class Organization {
    static readonly name = "debricked";
    static readonly command = os.platform() === "win32" ? "debricked.exe" : "debricked";
    static readonly debrickedFolder = `.${Organization.name}`;
    static readonly reports = "reports";
    static readonly log_file = "debricked.log";
    static readonly workspace = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || path.join(__dirname, "../../");
    static readonly debricked_cli = path.join(__dirname, `../resources/debricked-cli/cli/${Organization.command}`);
    static readonly debricked_installed_dir = path.join(__dirname, "../");
    static readonly reportsFolderPath = path.join(
        Organization.workspace,
        Organization.debrickedFolder,
        Organization.reports,
    );
    static readonly debricked_data_file = "debricked_data.json";
    static readonly debricked_data_filePath = path.join(
        Organization.debricked_installed_dir,
        Organization.debrickedFolder,
        Organization.debricked_data_file,
    );
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
    static readonly DEBRICKED_DATA_KEY = "debrickedData";
    static readonly SEQ_ID_KEY = "sequenceID";

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
