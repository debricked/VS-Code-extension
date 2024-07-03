const { exec } = require('child_process');
const path = require('path');
const os = require('os');

const platform = os.platform();
let uninstallScriptPath, installScriptPath, uninstallCommand, installCommand;

console.info("Debricked running in - ", platform);

switch (platform) {
    case 'win32':
        uninstallScriptPath = path.join(__dirname, './resources/debricked-cli/uninstall-debricked.ps1');
        installScriptPath = path.join(__dirname, './resources/debricked-cli/install-debricked.ps1');
        uninstallCommand = `powershell -ExecutionPolicy Bypass -File "${uninstallScriptPath}"`;
        installCommand = `powershell -ExecutionPolicy Bypass -File "${installScriptPath}"`;
        break;
    case 'linux':
    case 'darwin':
        uninstallScriptPath = path.join(__dirname, './resources/debricked-cli/uninstall-debricked.sh');
        installScriptPath = path.join(__dirname, './resources/debricked-cli/install-debricked.sh');
        uninstallCommand = `bash "${uninstallScriptPath}"`;
        installCommand = `bash "${installScriptPath}"`;
        break;
    default:
        console.error('Unsupported OS');
        process.exit(1);
}

exec(uninstallCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error during uninstall: ${stderr}`);
        process.exit(1);
    }
    console.log(`Uninstall output: ${stdout}`);

    exec(installCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error during installation: ${stderr}`);
            process.exit(1);
        }
        console.log(`Installation output: ${stdout}`);
    });
});
