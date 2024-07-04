const { exec } = require("child_process");
const path = require("path");
const os = require("os");

const platform = os.platform();
console.info("Debricked running on:", platform);

function getScriptPaths() {
    const scriptDir = path.join(__dirname, "./resources/debricked-cli");
    switch (platform) {
        case "win32":
            return {
                uninstall: path.join(scriptDir, "uninstall-debricked.bat"),
                install: path.join(scriptDir, "install-debricked.bat"),
                command: "", // No command prefix needed for .bat files
            };
        case "linux":
        case "darwin":
            return {
                uninstall: path.join(scriptDir, "uninstall-debricked.sh"),
                install: path.join(scriptDir, "install-debricked.sh"),
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

async function runScripts() {
    try {
        const { uninstall, install, command } = getScriptPaths();

        console.log("Starting un-installation...");
        const uninstallCommand =
            platform === "win32"
                ? `"${uninstall}"`
                : `${command} "${uninstall}"`;
        const uninstallOutput = await executeCommand(uninstallCommand);
        console.log("Uninstall output:", uninstallOutput);

        console.log("Starting installation...");
        const installCommand =
            platform === "win32" ? `"${install}"` : `${command} "${install}"`;
        const installOutput = await executeCommand(installCommand);
        console.log("Install output:", installOutput);

        console.log("Scripts executed successfully");
    } catch (error) {
        console.error("Script execution failed:", error.message);
        process.exit(1);
    }
}

runScripts();
