@echo off
setlocal enabledelayedexpansion

:: Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo This script needs to be run as an administrator.
    powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c %~dpnx0'"
    exit /b
)

:: Define release version
set "releaseVersion=v2.0.3"

:: Determine the architecture
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    set "arch=x86_64"
) else (
    set "arch=i386"
)

set "downloadUrl=https://github.com/debricked/cli/releases/download/%releaseVersion%/cli_windows_%arch%.tar.gz"
set "destinationPath=%~dp0debricked-cli.tar.gz"
set "extractPath=%~dp0cli"
set "installPath=C:\Program Files\debricked"

:: Download the file
echo Downloading Debricked CLI from %downloadUrl%
powershell -Command "Invoke-WebRequest -Uri '%downloadUrl%' -OutFile '%destinationPath%' -UseBasicParsing; if ($?) { exit 0 } else { exit 1 }"
if %errorLevel% neq 0 (
    echo Failed to download Debricked CLI
    pause
)

:: Create the extract path if it doesn't exist
if not exist "%extractPath%" (
    mkdir "%extractPath%" || (
        echo Failed to create extract path
        pause
    )
)

:: Extract the tar.gz file
echo Extracting Debricked CLI to %extractPath% ...
tar -xzf "%destinationPath%" -C "%extractPath%" || (
    echo Failed to extract Debricked CLI
    pause
)

:: Remove the tar.gz file
del "%destinationPath%" || (
    echo Failed to delete tar.gz file
    pause
)

:: Create the install path if it doesn't exist
if not exist "%installPath%" (
    mkdir "%installPath%" || (
        echo Failed to create install path
        pause
    )
)

:: Copy the extracted debricked.exe to the install path
echo Installing Debricked CLI to %installPath% ...
copy "%extractPath%\debricked.exe" "%installPath%\debricked.exe" /Y || (
    echo Failed to copy Debricked CLI to install path
    pause
)

:: Add the install path to the system PATH if not already present
echo Adding Debricked CLI to system PATH...
for /f "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path') do set "currentPath=%%B"
echo %currentPath% | find /i "%installPath%" > nul
if errorlevel 1 (
    setx /M PATH "%currentPath%;%installPath%" || (
        echo Failed to add Debricked CLI to system PATH
        pause
    )
)

:: Clean up the extraction path
rmdir /s /q "%extractPath%" || (
    echo Failed to clean up extraction path
    pause
)

echo Debricked(%releaseVersion%) CLI installation completed successfully.

:: Exit the terminal
pause
