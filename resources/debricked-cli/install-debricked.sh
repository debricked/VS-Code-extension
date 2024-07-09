#!/bin/bash

# Set log file path
logFile="/tmp/debricked_install.log"

# Start logging
echo "Debricked CLI Installation started at $(date)" > "$logFile"

# Define release version
releaseVersion="v2.0.3"

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

# Function to determine OS and architecture
set_os_and_arch() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        os="linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        os="macOS"
    else
        echo "Unsupported OS"
        echo "ERROR: Unsupported OS: $OSTYPE" >> "$logFile"
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
            echo "Unsupported architecture: $arch"
            echo "ERROR: Unsupported architecture: $arch" >> "$logFile"
            exit 1
            ;;
    esac

    echo "OS set to $os, architecture set to $arch." >> "$logFile"
}

# Function to download CLI
download_cli() {
    downloadUrl="https://github.com/debricked/cli/releases/download/$releaseVersion/cli_${os}_${arch}.tar.gz"
    echo "Downloading Debricked CLI from $downloadUrl"
    echo "Downloading from $downloadUrl" >> "$logFile"
    if ! curl -L $downloadUrl -o /tmp/debricked-cli.tar.gz; then
        echo "Failed to download Debricked CLI"
        echo "ERROR: Download failed." >> "$logFile"
        exit 1
    fi
    echo "Download successful." >> "$logFile"
}

# Function to extract CLI
extract_cli() {
    echo "Extracting Debricked CLI..."
    echo "Extracting CLI" >> "$logFile"
    if ! tar -xzf /tmp/debricked-cli.tar.gz -C /tmp; then
        echo "Failed to extract Debricked CLI"
        echo "ERROR: Extraction failed." >> "$logFile"
        exit 1
    fi
    echo "Extraction successful." >> "$logFile"
}

# Function to install CLI
install_cli() {
    installPath="/usr/local/bin/debricked"
    echo "Installing Debricked CLI to $installPath ..."
    echo "Installing to $installPath" >> "$logFile"
    if ! mv /tmp/debricked $installPath; then
        echo "Failed to install Debricked CLI"
        echo "ERROR: Installation failed." >> "$logFile"
        exit 1
    fi
    chmod +x $installPath
    echo "Installation successful." >> "$logFile"
}

# Function to clean up
cleanup() {
    echo "Cleaning up..."
    echo "Cleaning up" >> "$logFile"
    rm /tmp/debricked-cli.tar.gz
    echo "Cleanup successful." >> "$logFile"
}

# Main installation process
check_root
set_os_and_arch
download_cli
extract_cli
install_cli
cleanup

echo "Debricked($releaseVersion) CLI installation completed successfully."
echo "Debricked($releaseVersion) CLI installation completed successfully." >> "$logFile"
echo "See $logFile for details."