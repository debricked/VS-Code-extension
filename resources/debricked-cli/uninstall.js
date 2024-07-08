const { exec } = require("child_process");
const path = require("path");
const os = require("os");

const platform = os.platform();
console.info("Debricked running on:", platform);

function getScriptPath() {
    const scriptDir = path.join(__dirname, "./");
    switch (platform) {
        case "win32":
            return {
                uninstall: path.join(scriptDir, "uninstall-debricked.bat"),
                command: "", // No command prefix needed for .bat files
            };
        case "linux":
        case "darwin":
            return {
                uninstall: path.join(scriptDir, "uninstall-debricked.sh"),
                command: "bash",
            };
        default:
            throw new Error("Unsupported operating system");
    }
}

function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`Execution error: ${stderr}`));
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

async function runUninstallScript() {
    try {
        const { uninstall, command } = getScriptPath();

        console.log("Starting uninstallation...");
        const uninstallCommand =
            platform === "win32"
                ? `"${uninstall}"`
                : `${command} "${uninstall}"`;
        const uninstallOutput = await executeCommand(uninstallCommand);
        console.log("Uninstall output:", uninstallOutput);

        console.log("Uninstallation script executed successfully");
    } catch (error) {
        console.error("Uninstallation script execution failed:", error.message);
        process.exit(1);
    }
}

runUninstallScript();
