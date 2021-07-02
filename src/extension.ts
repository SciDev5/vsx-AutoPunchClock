import * as vscode from 'vscode';
import { TestTreeItem, TestTreeProvider } from './TestTreeProvider';

class DisposableRegistrar {
	readonly context: vscode.ExtensionContext;
	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}
	add(disposable: vscode.Disposable) {
		this.context.subscriptions.push(disposable);
	}
}

var edits:string[] = [];
var tp:TestTreeProvider;
var vyu:vscode.TreeView<TestTreeItem>;

export function activate(context: vscode.ExtensionContext) {
	const dump = new DisposableRegistrar(context);

	tp = new TestTreeProvider(edits);

	dump.add(vscode.window.registerTreeDataProvider("vyu",tp));
	vyu = vscode.window.createTreeView("vyu", {treeDataProvider:tp});
	

	dump.add(vscode.workspace.onDidChangeTextDocument(e => {
		for (let k of e.contentChanges) {
			edits.push(k.text+":"+k.rangeOffset);
			console.log(edits);
		}
		tp.refresh();
	}));
	
	dump.add(vscode.commands.registerCommand('vsx-autopunchclock.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from vsx-autopunchclock!');
	}));
}

export function deactivate() {}
