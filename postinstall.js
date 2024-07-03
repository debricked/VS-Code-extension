const { exec } = require('child_process');
const path = require('path');

const uninstallScriptPath = path.join(__dirname, './resources/debricked-cli/uninstall-debricked.ps1');
const installScriptPath = path.join(__dirname, './resources/debricked-cli/install-debricked.ps1');

exec(`powershell -ExecutionPolicy Bypass -File "${uninstallScriptPath}"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${stderr}`);
        process.exit(1);
    }
    console.log(`Output: ${stdout}`);
});

exec(`powershell -ExecutionPolicy Bypass -File "${installScriptPath}"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${stderr}`);
        process.exit(1);
    }
    console.log(`Output: ${stdout}`);
});
