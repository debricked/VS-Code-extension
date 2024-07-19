#!/bin/bash

# Set log file path
logFile="$(dirname "$0")/debricked_download.log"

# Start logging (append instead of overwrite)
echo "INFO: Debricked CLI Download started at $(date)" >> "$logFile"

# Define variables
releaseVersion="release-v2"
cliFolder="$(dirname "$0")/cli"

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

    echo "INFO: OS: $os, Architecture: $arch" >> "$logFile"
}

# Function to create cli folder
create_cli_folder() {
    if [ ! -d "$cliFolder" ]; then
        mkdir -p "$cliFolder"
        if [ $? -ne 0 ]; then
            echo "ERROR: Failed to create cli folder."
            echo "ERROR: Failed to create cli folder." >> "$logFile"
            exit 1
        fi
    fi
    echo "INFO: CLI folder created or already exists at $cliFolder" >> "$logFile"
}

# Function to download and extract CLI
download_and_extract_cli() {
    downloadUrl="https://github.com/debricked/cli/releases/download/$releaseVersion/cli_${os}_${arch}.tar.gz"
    echo "INFO: Downloading and extracting Debricked CLI from $downloadUrl"
    echo "INFO: Downloading and extracting from $downloadUrl" >> "$logFile"
    
    # Check if debricked already exists
    if [ -f "$cliFolder/debricked" ]; then
        echo "INFO: Existing debricked CLI found. Backing up before update." >> "$logFile"
        mv "$cliFolder/debricked" "$cliFolder/debricked.bak"
    fi
    
    # Download and extract debricked cli
    if curl -L "$downloadUrl" | tar -xz -C "$cliFolder" debricked; then
        echo "INFO: Download and extraction successful." | tee -a "$logFile"
        echo "INFO: debricked is now located in $cliFolder" | tee -a "$logFile"
        
        # Remove backup if update was successful
        if [ -f "$cliFolder/debricked.bak" ]; then
            rm "$cliFolder/debricked.bak"
            echo "INFO: Removed backup of previous version." >> "$logFile"
        fi
    else
        echo "ERROR: Failed to download or extract Debricked CLI."
        echo "ERROR: Download or extraction failed." >> "$logFile"
        
        # Restore backup if download failed
        if [ -f "$cliFolder/debricked.bak" ]; then
            mv "$cliFolder/debricked.bak" "$cliFolder/debricked"
            echo "INFO: Restored previous version due to download failure." >> "$logFile"
        fi
        exit 1
    fi
}

# Main process
determine_os_and_arch
create_cli_folder
download_and_extract_cli

echo "INFO: Debricked($releaseVersion) CLI download completed successfully."
echo "INFO: See $logFile for details."