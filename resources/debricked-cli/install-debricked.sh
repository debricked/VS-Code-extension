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
destinationPath="debricked-cli.tar.gz"
extractPath="cli"
installPath="/usr/local/bin/debricked"

# Download the file
echo "Downloading Debricked CLI from $downloadUrl"
curl -L $downloadUrl -o $destinationPath

# Create the extract path if it doesn't exist
mkdir -p $extractPath

# Extract the tar.gz file
echo "Extracting Debricked CLI to $extractPath ..."
tar -xzf $destinationPath -C $extractPath

# Remove the tar.gz file
rm $destinationPath

# Create the install path if it doesn't exist
sudo mkdir -p $(dirname $installPath)

# Copy the extracted debricked executable to the install path
echo "Installing Debricked CLI to $installPath ..."
sudo cp $extractPath/debricked /usr/local/bin/debricked
sudo chmod +x /usr/local/bin/debricked

# Clean up the extraction path
rm -r $extractPath

echo "Debricked($releaseVersion) CLI installation completed successfully."
