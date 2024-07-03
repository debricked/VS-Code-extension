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

:: Remove the debricked.exe file
if exist "%exePath%" (
    echo Removing debricked.exe...
    del /F /Q "%exePath%"
) else (
    echo WARNING: debricked.exe not found at %exePath%
)

:: Remove the install directory if it is empty
if exist "%installPath%" (
    dir /b "%installPath%" | findstr "^" >nul && (
        echo Install directory is not empty.
    ) || (
        echo Removing install directory...
        rmdir "%installPath%"
    )
)

:: Remove the cli folder
if exist "%cliFolder%" (
    echo Removing cli folder...
    rmdir /S /Q "%cliFolder%"
) else (
    echo WARNING: cli folder not found at %cliFolder%
)

:: Remove the install path from the system PATH
echo Removing install path from system PATH...
for /f "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path') do set "path=%%B"
set "newpath=!path:%installPath%;=!"
if not "!newpath!"=="!path!" (
    setx /M PATH "!newpath!"
)

echo Debricked CLI uninstallation completed successfully.

:: Exit the terminal
exit