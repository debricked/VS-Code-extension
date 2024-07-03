const { exec } = require('child_process');
const path = require('path');
const os = require('os');

const platform = os.platform();
console.info("Debricked running on:", platform);

function getScriptPaths() {
    const scriptDir = path.join(__dirname, './resources/debricked-cli');
    switch (platform) {
        case 'win32':
            return {
                uninstall: path.join(scriptDir, 'uninstall-debricked.ps1'),
                install: path.join(scriptDir, 'install-debricked.ps1'),
                command: 'powershell -ExecutionPolicy Bypass -File'
            };
        case 'linux':
        case 'darwin':
            return {
                uninstall: path.join(scriptDir, 'uninstall-debricked.sh'),
                install: path.join(scriptDir, 'install-debricked.sh'),
                command: 'bash'
            };
        default:
            throw new Error('Unsupported operating system');
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

        console.log('Starting un-installation...');
        const uninstallOutput = await executeCommand(`${command} "${uninstall}"`);
        console.log('Uninstall output:', uninstallOutput);

        console.log('Starting installation...');
        const installOutput = await executeCommand(`${command} "${install}"`);
        console.log('Install output:', installOutput);

        console.log('Scripts executed successfully');
    } catch (error) {
        console.error('Script execution failed:', error.message);
        process.exit(1);
    }
}

runScripts();