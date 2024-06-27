# Debricked VS Code Extension

A Visual Studio Code extension that integrates the Debricked CLI to provide security vulnerability scanning and license compliance directly within the editor.

## Features

- Run Debricked CLI commands directly from VS Code
- Display results in a user-friendly way within the editor
- Status bar updates for command execution progress
- Store and reuse user inputs like email and commit ID
- Detailed logging of command execution and errors

## Installation

1. Clone this repository.
2. Open the project in Visual Studio Code.
3. Run `npm install` to install the required dependencies.
4. Press `F5` to open a new VS Code window with the extension loaded.

## Usage

### Running Commands

1. Search for Debricked commands from VS code commands.
2. Select the command you want to execute from the list of available commands.
3. Follow the prompts to provide any necessary inputs.

## Development

### Running the Extension

1. Open the project in Visual Studio Code.
2. Press `F5` to open a new VS Code window with the extension loaded.

### Packaging the Extension

Run `vsce package` to create a `.vsix` file for the extension.

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Credits

Developed by [debricked](https://github.com/debricked).
