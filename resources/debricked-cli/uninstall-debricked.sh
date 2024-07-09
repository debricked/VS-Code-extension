#!/bin/bash

# Set log file path
logFile="/tmp/debricked_uninstall.log"

# Start logging
echo "Debricked CLI Uninstallation started at $(date)" > "$logFile"

# Define install path
installPath="/usr/local/bin/debricked"

# Function to check for root privileges
check_root() {
    if [ "$EUID" -ne 0 ]; then 
        echo "This script needs to be run as root."
        echo "ERROR: Script not run as root." >> "$logFile"
        sudo "$0" "$@"
        exit $?
    fi
    echo "Root privileges confirmed." >> "$logFile"
}

# Function to uninstall CLI
uninstall_cli() {
    if [ -f "$installPath" ]; then
        echo "Uninstalling Debricked CLI from $installPath ..."
        echo "Attempting to uninstall from $installPath" >> "$logFile"
        if sudo rm "$installPath"; then
            echo "Debricked CLI uninstalled successfully."
            echo "Uninstallation successful." >> "$logFile"
        else
            echo "Failed to uninstall Debricked CLI."
            echo "ERROR: Uninstallation failed." >> "$logFile"
            exit 1
        fi
    else
        echo "Debricked CLI is not installed at $installPath."
        echo "CLI not found at $installPath. No action taken." >> "$logFile"
    fi
}

# Main uninstallation process
check_root
uninstall_cli

echo "Debricked CLI uninstallation process completed."
echo "Uninstallation process completed at $(date)" >> "$logFile"
echo "See $logFile for details."