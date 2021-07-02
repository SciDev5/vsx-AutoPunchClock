import * as vscode from 'vscode';
import { WorkTimeTreeItem, WorkTimesTreeProvider } from './WorkTimesTreeProvider';
import { WorkTime, WorkTimeJSON } from './timing/WorkTime';

class DisposableRegistrar {
	readonly context: vscode.ExtensionContext;
	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}
	add(disposable: vscode.Disposable) {
		this.context.subscriptions.push(disposable);
	}
}

var timesTreeProvider:WorkTimesTreeProvider;
var timesTreeView:vscode.TreeView<WorkTimeTreeItem>;
var workTimesJSON:WorkTimeJSON[] = [
	["coding",348,9758],
	["idle",98533555,98533555],
	["browsing",3768909876,3768909876]
];
var workTimes:WorkTime[] = workTimesJSON.map(v=>WorkTime.createFromJSON(v));

export function activate(context: vscode.ExtensionContext) {
	const dump = new DisposableRegistrar(context);


	timesTreeProvider = new WorkTimesTreeProvider(workTimes);

	dump.add(vscode.window.registerTreeDataProvider("apc-times",timesTreeProvider));
	//timesTreeView = vscode.window.createTreeView("apc-times", {treeDataProvider:timesTreeProvider});
	

	dump.add(vscode.workspace.onDidChangeTextDocument(e => {
		for (let k of e.contentChanges)
			console.log(k);
		timesTreeProvider.refresh();
	}));
	
	dump.add(vscode.commands.registerCommand('vsx-autopunchclock.showMenu', () => {
		vscode.window.showInformationMessage('Hello World from vsx-autopunchclock!');
	}));
}

export function deactivate() {}
