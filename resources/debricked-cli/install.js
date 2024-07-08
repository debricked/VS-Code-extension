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
                install: path.join(scriptDir, "install-debricked.bat"),
                command: "", // No command prefix needed for .bat files
            };
        case "linux":
        case "darwin":
            return {
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

async function runInstallScript() {
    try {
        const { install, command } = getScriptPath();

        console.log("Starting installation...");
        const installCommand =
            platform === "win32" ? `"${install}"` : `${command} "${install}"`;
        const installOutput = await executeCommand(installCommand);
        console.log("Install output:", installOutput);

        console.log("Installation script executed successfully");
    } catch (error) {
        console.error("Installation script execution failed:", error.message);
        process.exit(1);
    }
}

runInstallScript();
