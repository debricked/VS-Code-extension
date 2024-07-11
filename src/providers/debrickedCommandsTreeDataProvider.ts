import { DebrickedCommands } from "../constants/index";
import * as vscode from "vscode";
import { DebrickedCommandNode } from "types";

export class DebrickedCommandsTreeDataProvider implements vscode.TreeDataProvider<DebrickedCommandNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<DebrickedCommandNode | undefined | null | void> =
        new vscode.EventEmitter<DebrickedCommandNode | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<DebrickedCommandNode | undefined | null | void> =
        this._onDidChangeTreeData.event;

    getTreeItem(element: DebrickedCommandNode): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(
            element.label,
            element.sub_commands ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
        );

        if (element.command) {
            treeItem.command = {
                command: element.command,
                title: element.label,
            };
            treeItem.contextValue = "command";
        }

        // Set tooltip to description
        if (element.description) {
            treeItem.tooltip = element.description;
            treeItem.description = element.description;
        }

        return treeItem;
    }

    getChildren(element?: DebrickedCommandNode): Thenable<DebrickedCommandNode[]> {
        if (element) {
            return Promise.resolve(element.sub_commands || []);
        } else {
            return Promise.resolve(DebrickedCommands.getAllCommands() || []);
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}
