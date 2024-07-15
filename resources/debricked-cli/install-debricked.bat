@echo off
setlocal enabledelayedexpansion

:: Set log file path
set "logFile=%TEMP%\debricked_install.log"

:: Start logging
echo Debricked CLI Installation started at %date% %time% > "%logFile%"

:: Check for admin rights
call :check_admin || exit /b

:: Define variables
set "releaseVersion=release-v2"
call :set_architecture
set "downloadUrl=https://github.com/debricked/cli/releases/download/%releaseVersion%/cli_windows_%arch%.tar.gz"
set "destinationPath=%~dp0debricked-cli.tar.gz"
set "extractPath=%~dp0cli"
set "installPath=C:\Program Files\debricked"

:: Main installation process
call :download_cli || exit /b
call :extract_cli || exit /b
call :install_cli || exit /b
call :cleanup || exit /b

echo Debricked(%releaseVersion%) CLI installation completed successfully.
echo See %logFile% for details.
pause
exit /b

:: Functions
:check_admin
    net session >nul 2>&1
    if %errorLevel% neq 0 (
        echo This script needs to be run as an administrator.
        echo ERROR: Script not run as administrator. >> "%logFile%"
        powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c %~dpnx0'"
        exit /b 1
    )
    echo Admin rights confirmed. >> "%logFile%"
    exit /b 0

:set_architecture
    if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
        set "arch=x86_64"
    ) else (
        set "arch=i386"
    )
    echo Architecture set to %arch%. >> "%logFile%"
    exit /b 0

:download_cli
    echo Downloading Debricked CLI from %downloadUrl%
    echo Downloading from %downloadUrl% >> "%logFile%"
    powershell -Command "Invoke-WebRequest -Uri '%downloadUrl%' -OutFile '%destinationPath%' -UseBasicParsing; if ($?) { exit 0 } else { exit 1 }"
    if %errorLevel% neq 0 (
        echo Failed to download Debricked CLI
        echo ERROR: Download failed. >> "%logFile%"
        exit /b 1
    )
    echo Download successful. >> "%logFile%"
    exit /b 0

:extract_cli
    if not exist "%extractPath%" mkdir "%extractPath%" || (
        echo ERROR: Failed to create extract path. >> "%logFile%"
        exit /b 1
    )
    echo Extracting Debricked CLI to %extractPath% ...
    echo Extracting to %extractPath% >> "%logFile%"
    tar -xzf "%destinationPath%" -C "%extractPath%" || (
        echo ERROR: Extraction failed. >> "%logFile%"
        exit /b 1
    )
    del "%destinationPath%" || (
        echo ERROR: Failed to delete downloaded file. >> "%logFile%"
        exit /b 1
    )
    echo Extraction successful. >> "%logFile%"
    exit /b 0

:install_cli
    if not exist "%installPath%" mkdir "%installPath%" || (
        echo ERROR: Failed to create install path. >> "%logFile%"
        exit /b 1
    )
    echo Installing Debricked CLI to %installPath% ...
    echo Installing to %installPath% >> "%logFile%"
    copy "%extractPath%\debricked.exe" "%installPath%\debricked.exe" /Y || (
        echo ERROR: Failed to copy executable. >> "%logFile%"
        exit /b 1
    )
    echo Installation successful. >> "%logFile%"
    exit /b 0

:cleanup
    rmdir /s /q "%extractPath%" || (
        echo ERROR: Failed to clean up extract path. >> "%logFile%"
        exit /b 1
    )
    echo Cleanup successful. >> "%logFile%"
    echo Debricked(%releaseVersion%) CLI installation completed successfully. >> "%logFile%"
    exit /b 0