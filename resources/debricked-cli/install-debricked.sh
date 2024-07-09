#!/bin/bash

# Set log file path
logFile="/tmp/debricked_install.log"

# Start logging
echo "Debricked CLI Installation started at $(date)" > "$logFile"

# Define variables
releaseVersion="v2.0.3"
installPath="/usr/local/bin/debricked"

# Function to determine OS and architecture
determine_os_and_arch() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        os="linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        os="macOS"
    else
        echo "Unsupported OS"
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
            echo "Unsupported architecture: $arch"
            echo "ERROR: Unsupported architecture: $arch" >> "$logFile"
            exit 1
            ;;
    esac

    echo "$os" "$arch"
}

# Function to download and extract CLI
download_and_extract() {
    local downloadUrl="$1"
    echo "Downloading and extracting Debricked CLI from $downloadUrl"
    echo "Attempting to download from $downloadUrl" >> "$logFile"
    if curl -L "$downloadUrl" | tar -xz debricked; then
        echo "Download and extraction successful." >> "$logFile"
    else
        echo "Failed to download or extract Debricked CLI."
        echo "ERROR: Download or extraction failed." >> "$logFile"
        exit 1
    fi
}

# Function to install CLI
install_cli() {
    echo "Installing Debricked CLI to $installPath ..."
    echo "Attempting to install to $installPath" >> "$logFile"
    if sudo mv debricked "$installPath" && sudo chmod +x "$installPath"; then
        echo "Debricked CLI installed successfully."
        echo "Installation successful." >> "$logFile"
    else
        echo "Failed to install Debricked CLI."
        echo "ERROR: Installation failed." >> "$logFile"
        exit 1
    fi
}

# Main installation process
read -r os arch < <(determine_os_and_arch)
downloadUrl="https://github.com/debricked/cli/releases/download/$releaseVersion/cli_${os}_${arch}.tar.gz"

download_and_extract "$downloadUrl"
install_cli

echo "Debricked($releaseVersion) CLI installation process completed."
echo "Installation process completed at $(date)" >> "$logFile"
echo "See $logFile for details."