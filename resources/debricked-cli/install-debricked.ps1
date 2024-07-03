function Test-Admin {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Admin)) {
    Write-Warning "This script needs to be run as an administrator."
    Start-Process powershell -Verb runAs -ArgumentList ('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $MyInvocation.MyCommand.Path)
    exit
}


# Define release version
$releaseVersion = "v2.0.3"

# Determine the OS and architecture
$os = $null
$arch = $null

if ([System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform([System.Runtime.InteropServices.OSPlatform]::Windows)) {
    $os = "windows"

    Write-Host $PSVersionTable.PSVersion
    Write-Host ([System.Environment]::OSVersion)

    if ([System.Environment]::Is64BitProcess) {
        $arch = "x86_64"
    }
    else {
        $arch = "i386"
    }
}
elseif ($IsLinux) {
    $os = "linux"
    if ([System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture -eq "Arm64") {
        $arch = "arm64"
    }
    elseif ([System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture -eq "X64") {
        $arch = "x86_64"
    }
    else {
        $arch = "i386"
    }
}
elseif ($IsMacOS) {
    $os = "macOS"
    if ([System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture -eq "Arm64") {
        $arch = "arm64"
    }
    else {
        $arch = "x86_64"
    }
}
else {
    Write-Error "Unsupported OS"
    exit 1
}

$downloadUrl = "https://github.com/debricked/cli/releases/download/$releaseVersion/cli_${os}_${arch}.tar.gz"
$destinationPath = "debricked-cli.tar.gz"
$extractPath = "cli"
$installPath = "C:\Program Files\debricked"

# Download the file
Write-Host "Downloading Debricked CLI from $downloadUrl"
Invoke-WebRequest -Uri $downloadUrl -OutFile $destinationPath

# Create the extract path if it doesn't exist
if (-Not (Test-Path -Path $extractPath)) {
    New-Item -ItemType Directory -Path $extractPath
}

# Extract the tar.gz file
Write-Host "Extracting Debricked CLI to $extractPath ..."
tar -xzf $destinationPath -C $extractPath

# Remove the tar.gz file
Remove-Item $destinationPath

# Create the install path if it doesn't exist
if (-Not (Test-Path -Path $installPath)) {
    New-Item -ItemType Directory -Path $installPath -Force
}

# Move the extracted debricked.exe to the install path
Write-Host "Installing Debricked CLI $installPath ..."
Copy-Item "$extractPath/debricked.exe" "$installPath/debricked.exe" -Force

# Optionally, add the install path to the system PATH if not already present
if (-not [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine).Contains($installPath)) {
    Write-Host "Adding Debricked CLI to system PATH..."
    [System.Environment]::SetEnvironmentVariable("Path", [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine) + ";$installPath", [System.EnvironmentVariableTarget]::Machine)
}

# Clean up the extraction path
# Remove-Item -Recurse -Force $extractPath

Write-Host "Debricked($releaseVersion) CLI of cli_${os}_${arch} installation completed successfully."
