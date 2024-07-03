#!/bin/bash

# Define install path
installPath="/usr/local/bin/debricked"

# Check if the file exists and remove it
if [ -f "$installPath" ]; then
    echo "Uninstalling Debricked CLI from $installPath ..."
    sudo rm "$installPath"
    echo "Debricked CLI uninstalled successfully."
else
    echo "Debricked CLI is not installed."
fi
