@echo off
setlocal enabledelayedexpansion

:: Set log file path
set "logFile=%~dp0\debricked_install.log"

:: Start logging
echo INFO: Debricked CLI Installation started at %date% %time% > "%logFile%"

:: Check for admin rights
call :check_admin || exit /b

:: Define variables
set "releaseVersion=release-v2"
call :set_architecture
set "downloadUrl=https://github.com/debricked/cli/releases/download/%releaseVersion%/cli_windows_%arch%.tar.gz"
set "destinationPath=%~dp0debricked-cli.tar.gz"
set "extractPath=%~dp0cli"
set "installPath=C:\Program Files\debricked"
set "exePath=%installPath%\debricked.exe"

:: Main installation process
call :remove_exe
call :remove_install_dir

call :download_cli || exit /b
call :extract_cli || exit /b
call :install_cli || exit /b
call :cleanup || exit /b

echo INFO: Debricked(%releaseVersion%) CLI installation completed successfully.
debricked
debricked >> "%logFile%"
echo INFO: See %logFile% for details.
timeout 10
exit /b

:: Functions
:check_admin
    net session >nul 2>&1
    if %errorLevel% neq 0 (
        echo WARNING: This script needs to be run as an administrator.
        echo ERROR: Script not run as administrator. >> "%logFile%"
        powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c %~dpnx0'"
        exit /b 1
    )
    echo INFO: Admin rights confirmed. >> "%logFile%"
    exit /b 0

:set_architecture
    if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
        set "arch=x86_64"
    ) else (
        set "arch=i386"
    )
    echo INFO: Architecture set to %arch%. >> "%logFile%"
    exit /b 0

:remove_exe
    if exist "%exePath%" (
        echo INFO: Removing debricked.exe...
        del /F /Q "%exePath%" 2>>"%logFile%" && (
            echo INFO: debricked.exe removed successfully. >> "%logFile%"
        ) || (
            echo ERROR: Failed to remove debricked.exe. >> "%logFile%"
        )
    ) else (
        echo WARNING: debricked.exe not found at %exePath% >> "%logFile%"
    )
    exit /b 0

:remove_install_dir
    if exist "%installPath%" (
        dir /b "%installPath%" | findstr "^" >nul && (
            echo WARNING: Install directory is not empty. Skipping removal. >> "%logFile%"
        ) || (
            echo INFO: Removing install directory...
            rmdir "%installPath%" 2>>"%logFile%" && (
                echo INFO: Install directory removed successfully. >> "%logFile%"
            ) || (
                echo ERROR: Failed to remove install directory. >> "%logFile%"
            )
        )
    ) else (
        echo WARNING: Install directory not found at %installPath% >> "%logFile%"
    )
    exit /b 0

:download_cli
    echo INFO: Downloading Debricked CLI from %downloadUrl%
    echo INFO: Downloading from %downloadUrl% >> "%logFile%"
    powershell -Command "Invoke-WebRequest -Uri '%downloadUrl%' -OutFile '%destinationPath%' -UseBasicParsing; if ($?) { exit 0 } else { exit 1 }"
    if %errorLevel% neq 0 (
        echo ERROR: Failed to download Debricked CLI
        echo ERROR: Download failed. >> "%logFile%"
        exit /b 1
    )
    echo INFO: Download successful. >> "%logFile%"
    exit /b 0

:extract_cli
    if not exist "%extractPath%" mkdir "%extractPath%" || (
        echo ERROR: Failed to create extract path. >> "%logFile%"
        exit /b 1
    )
    echo INFO: Extracting Debricked CLI to %extractPath% ...
    echo INFO: Extracting to %extractPath% >> "%logFile%"
    tar -xzf "%destinationPath%" -C "%extractPath%" || (
        echo ERROR: Extraction failed. >> "%logFile%"
        exit /b 1
    )
    del "%destinationPath%" || (
        echo ERROR: Failed to delete downloaded file. >> "%logFile%"
        exit /b 1
    )
    echo INFO: Extraction successful. >> "%logFile%"
    exit /b 0

:install_cli
    if not exist "%installPath%" mkdir "%installPath%" || (
        echo ERROR: Failed to create install path. >> "%logFile%"
        exit /b 1
    )
    echo INFO: Installing Debricked CLI to %installPath% ...
    echo INFO: Installing to %installPath% >> "%logFile%"
    copy "%extractPath%\debricked.exe" "%exePath%" /Y || (
        echo ERROR: Failed to copy executable. >> "%logFile%"
        exit /b 1
    )
    echo INFO: Installation successful. >> "%logFile%"
    exit /b 0

:cleanup
    rmdir /s /q "%extractPath%" || (
        echo ERROR: Failed to clean up extract path. >> "%logFile%"
        exit /b 1
    )
    echo INFO: Cleanup successful. >> "%logFile%"
    echo INFO: Debricked(%releaseVersion%) CLI installation completed successfully. >> "%logFile%"
    exit /b 0