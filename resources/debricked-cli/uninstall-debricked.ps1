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

$installPath = "C:\Program Files\debricked"
$exePath = "$installPath\debricked.exe"

# Remove the debricked.exe file
if (Test-Path -Path $exePath) {
    Write-Host "Removing debricked.exe..."
    Remove-Item -Path $exePath -Force
}
else {
    Write-Warning "debricked.exe not found at $exePath"
}

# Remove the install directory if it is empty
if ((Test-Path -Path $installPath) -and (Get-ChildItem -Path $installPath | Measure-Object).Count -eq 0) {
    Write-Host "Removing install directory..."
    Remove-Item -Path $installPath -Force
}

# Optionally, remove the install path from the system PATH
$path = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
if ($path.Contains($installPath)) {
    Write-Host "Removing install path from system PATH..."
    $newPath = $path -replace [Regex]::Escape(";$installPath"), ''
    [System.Environment]::SetEnvironmentVariable("Path", $newPath, [System.EnvironmentVariableTarget]::Machine)
}

Write-Host "Debricked CLI uninstallation completed successfully."
