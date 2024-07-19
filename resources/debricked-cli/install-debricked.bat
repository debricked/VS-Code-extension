@echo off
setlocal enabledelayedexpansion

:: Set log file path
set "logFile=%~dp0debricked_download.log"

echo INFO: Debricked CLI Download started at %date% %time% >> "%logFile%"

:: Define variables
set "releaseVersion=release-v2"
call :set_architecture
set "downloadUrl=https://github.com/debricked/cli/releases/download/%releaseVersion%/cli_windows_%arch%.tar.gz"
set "cliFolder=%~dp0cli"

:: Main download process
call :create_cli_folder || exit /b
call :download_and_extract_cli || exit /b

echo INFO: Debricked(%releaseVersion%) CLI download completed successfully.
echo INFO: See %logFile% for details.
exit /b

:: Functions
:set_architecture
    if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
        set "arch=x86_64"
    ) else (
        set "arch=i386"
    )
    echo INFO: Architecture set to %arch%. >> "%logFile%"
    exit /b 0

:create_cli_folder
    if not exist "%cliFolder%" (
        mkdir "%cliFolder%" || (
            echo ERROR: Failed to create cli folder. >> "%logFile%"
            exit /b 1
        )
    )
    echo INFO: CLI folder created or already exists. >> "%logFile%"
    exit /b 0

:download_and_extract_cli
    echo INFO: Downloading and extracting Debricked CLI from %downloadUrl%
    echo INFO: Downloading and extracting from %downloadUrl% >> "%logFile%"
    
    :: Check if debricked.exe already exists
    if exist "%cliFolder%\debricked.exe" (
        echo INFO: Existing debricked.exe found. Backing up before update. >> "%logFile%"
        move "%cliFolder%\debricked.exe" "%cliFolder%\debricked.exe.bak"
    )

    :: Download and extract debricked cli
    curl -L "%downloadUrl%" | tar -xz -C "%cliFolder%" debricked.exe
    if %errorLevel% neq 0 (
        echo ERROR: Failed to download or extract Debricked CLI
        echo ERROR: Download or extraction failed. >> "%logFile%"

        :: Restore backup if download failed
        if exist "%cliFolder%\debricked.exe.bak" (
            move "%cliFolder%\debricked.exe.bak" "%cliFolder%\debricked.exe"
            echo INFO: Restored previous version due to download failure. >> "%logFile%"
        )
        exit /b 1
    )

    echo INFO: Download and extraction successful. >> "%logFile%"
    echo INFO: debricked.exe is now located in %cliFolder% >> "%logFile%"
    
    :: Remove backup if update was successful
    if exist "%cliFolder%\debricked.exe.bak" (
        del "%cliFolder%\debricked.exe.bak"
        echo INFO: Removed backup of previous version. >> "%logFile%"
    )
    exit /b 0