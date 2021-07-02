import * as vscode from "vscode";

export class TestTreeProvider implements vscode.TreeDataProvider<TestTreeItem> {
    yeet: string[];
    constructor(yeet:string[]) {
        this.yeet = yeet;
    }
    getTreeItem(element: TestTreeItem): vscode.TreeItem {
        return element;
    }
    getChildren(element?: TestTreeItem): vscode.ProviderResult<TestTreeItem[]> {
        if (!element)
            return this.yeet.map(str => new TestTreeItem(str));
        else return [];
    }
    private _onDidChangeTreeData: vscode.EventEmitter<TestTreeItem | undefined | null | void> = new vscode.EventEmitter<TestTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TestTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}

export class TestTreeItem extends vscode.TreeItem {
    constructor(label:string) {
        super(label);
    }
    
}