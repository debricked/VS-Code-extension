export class Messages {
    static readonly AUTH_RQD = "Authentication is required.";

    // Access Token Messages
    static readonly ACCESS_TOKEN = "Debricked access token";
    static readonly ENTER_ACCESS_TOKEN = "Please enter your Debricked access token.";
    static readonly ACCESS_TOKEN_SAVED = "Access token has been successfully saved.";

    // Bearer Token Messages
    static readonly BEARER_TOKEN_SAVED = "Bearer token has been successfully saved.";

    // Workspace Messages
    static readonly WS_NOT_FOUND = "No workspace folder found. Please open a workspace to proceed.";
    static readonly NO_REPO = "No repository selected";

    // Quick Pick Messages
    static readonly QUICK_PICK_FLAG = "Select a flag to use (optional).";
    static readonly QUICK_PICK_TOKEN = "Select a token to update";
    static readonly QUICK_PICK_SUB_COMMAND = "Select a sub-command to use (optional).";

    // Command Execution Messages
    static readonly CMD_EXEC_WITH_ACCESS_TOKEN = "Executing command with access token.";
    static readonly CMD_EXEC_WITHOUT_ACCESS_TOKEN = "Executing command without access token.";

    // Installation Messages
    static readonly UNSUPPORTED_OS = "Unsupported operating system.";
    static readonly INSTALLATION_SUCCESS = "Installation script executed successfully.";
    static readonly INSTALLATION_ERROR = "Installation script execution failed.";

    // Miscellaneous Messages
    static readonly RESET_SUCCESS = "Successfully reset debricked.";
    static readonly SCANNING_INPROGRESS = "Scan is still in process. Please wait...";
}
