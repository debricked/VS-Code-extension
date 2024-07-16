#!/bin/bash

# Set log file path
logFile="/debricked_install.log"

# Start logging
echo "INFO: Debricked CLI Installation started at $(date)" > "$logFile"

# Define variables
releaseVersion="release-v2"
installPath="/usr/local/bin/debricked"


# Function to uninstall CLI
uninstall_cli() {
    if [ -f "$installPath" ]; then
        echo "INFO: Uninstalling Debricked CLI from $installPath ..."
        echo "WARNING: Attempting to uninstall from $installPath" >> "$logFile"
        if sudo rm "$installPath"; then
            echo "INFO: Debricked CLI uninstalled successfully."
            echo "INFO: Uninstallation successful." >> "$logFile"
        else
            echo "ERROR: Failed to uninstall Debricked CLI."
            echo "ERROR: Uninstallation failed." >> "$logFile"
            exit 1
        fi
    else
        echo "WARNING: Debricked CLI is not installed at $installPath."
        echo "WARNING: CLI not found at $installPath. No action taken." >> "$logFile"
    fi
}

# Main uninstallation process
check_root
uninstall_cli

echo "INFO: Debricked CLI uninstallation process completed."
echo "INFO: Uninstallation process completed at $(date)" >> "$logFile"

# Function to determine OS and architecture
determine_os_and_arch() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        os="linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        os="macOS"
    else
        echo "ERROR: Unsupported OS"
        echo "ERROR: Unsupported OS" >> "$logFile"
        exit 1
    fi

    arch=$(uname -m)
    case $arch in
        "x86_64")
            arch="x86_64"
            ;;
        "aarch64" | "arm64")
            arch="arm64"
            ;;
        "i686" | "i386")
            arch="i386"
            ;;
        *)
            echo "ERROR: Unsupported architecture: $arch"
            echo "ERROR: Unsupported architecture: $arch" >> "$logFile"
            exit 1
            ;;
    esac

    echo "$os" "$arch"
}

# Function to download and extract CLI
download_and_extract() {
    local downloadUrl="$1"
    echo "INFO: Downloading and extracting Debricked CLI from $downloadUrl"
    echo "INFO: Attempting to download from $downloadUrl" >> "$logFile"
    if curl -L "$downloadUrl" | tar -xz debricked; then
        echo "INFO: Download and extraction successful." >> "$logFile"
    else
        echo "ERROR: Failed to download or extract Debricked CLI."
        echo "ERROR: Download or extraction failed." >> "$logFile"
        exit 1
    fi
}

# Function to install CLI
install_cli() {
    echo "INFO: Installing Debricked CLI to $installPath ..."
    echo "INFO: Attempting to install to $installPath" >> "$logFile"
    if sudo mv debricked "$installPath" && sudo chmod +x "$installPath"; then
        echo "INFO: Debricked CLI installed successfully."
        echo "INFO: Installation successful." >> "$logFile"
    else
        echo "ERROR: Failed to install Debricked CLI."
        echo "ERROR: Installation failed." >> "$logFile"
        exit 1
    fi
}

# Main installation process
read -r os arch < <(determine_os_and_arch)
downloadUrl="https://github.com/debricked/cli/releases/download/$releaseVersion/cli_${os}_${arch}.tar.gz"

download_and_extract "$downloadUrl"
install_cli

echo "INFO: Debricked($releaseVersion) CLI installation process completed."
echo "INFO: Installation process completed at $(date)" >> "$logFile"
echo "INFO: See $logFile for details."