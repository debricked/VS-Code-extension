@echo off
setlocal enabledelayedexpansion

:: Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo This script needs to be run as an administrator.
    powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c %~dpnx0'"
    exit /b
)

set "installPath=C:\Program Files\debricked"
set "exePath=%installPath%\debricked.exe"
set "cliFolder=%~dp0cli"
set "logFile=%TEMP%\debricked_uninstall.log"

echo Debricked CLI Uninstallation started at %date% %time% > "%logFile%"

call :remove_exe
call :remove_install_dir
call :remove_cli_folder
call :update_system_path

echo Debricked CLI uninstallation completed successfully.
echo See %logFile% for details.

timeout 10
exit /b

:remove_exe
    if exist "%exePath%" (
        echo Removing debricked.exe...
        del /F /Q "%exePath%" 2>>"%logFile%" && (
            echo debricked.exe removed successfully. >> "%logFile%"
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
            echo Removing install directory...
            rmdir "%installPath%" 2>>"%logFile%" && (
                echo Install directory removed successfully. >> "%logFile%"
            ) || (
                echo ERROR: Failed to remove install directory. >> "%logFile%"
            )
        )
    ) else (
        echo WARNING: Install directory not found at %installPath% >> "%logFile%"
    )
    exit /b 0

:remove_cli_folder
    if exist "%cliFolder%" (
        echo Removing cli folder...
        rmdir /S /Q "%cliFolder%" 2>>"%logFile%" && (
            echo cli folder removed successfully. >> "%logFile%"
        ) || (
            echo ERROR: Failed to remove cli folder. >> "%logFile%"
        )
    ) else (
        echo WARNING: cli folder not found at %cliFolder% >> "%logFile%"
    )
    exit /b 0

:update_system_path
    echo Updating system PATH...
    for /f "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path') do set "path=%%B"
    set "newpath=!path:%installPath%;=!"
    if not "!newpath!"=="!path!" (
        setx /M PATH "!newpath!" >nul 2>>"%logFile%" && (
            echo System PATH updated successfully. >> "%logFile%"
        ) || (
            echo ERROR: Failed to update system PATH. >> "%logFile%"
        )
    ) else (
        echo Install path was not found in system PATH. No update needed. >> "%logFile%"
    )
    exit /b 0