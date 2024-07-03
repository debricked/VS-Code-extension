#!/bin/bash

# Define release version
releaseVersion="v2.0.3"

# Determine the OS and architecture
os=""
arch=""

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    os="linux"
    arch=$(uname -m)
elif [[ "$OSTYPE" == "darwin"* ]]; then
    os="macOS"
    arch=$(uname -m)
else
    echo "Unsupported OS"
    exit 1
fi

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
        exit 1
        ;;
esac

downloadUrl="https://github.com/debricked/cli/releases/download/$releaseVersion/cli_${os}_${arch}.tar.gz"
installPath="/usr/local/bin/debricked"

# Download and extract the file directly
echo "Downloading and extracting Debricked CLI from $downloadUrl"
curl -L $downloadUrl | tar -xz debricked

# Move the extracted debricked executable to the install path
echo "Installing Debricked CLI to $installPath ..."
sudo mv debricked $installPath
sudo chmod +x $installPath

echo "Debricked($releaseVersion) CLI installation completed successfully."
