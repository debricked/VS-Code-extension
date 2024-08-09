import * as vscode from "vscode";

export class Template {
    constructor() {}
    public getLicenseContent(data: string, contents: vscode.MarkdownString) {
        contents.appendMarkdown(`License: **${data}**`);
    }
}
