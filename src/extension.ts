import * as vscode from 'vscode';
import { WorkTimesTreeProvider, WorkTimesTreeItem } from './work-time-tree/WorkTimesTreeProvider';
import { WorkInstanceTreeItem } from "./work-time-tree/WorkTimeItem";
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
var timesTreeView:vscode.TreeView<WorkTimesTreeItem>;
var workTimesJSON:WorkTimeJSON[] = [
	["coding",348,2233],
	["idle",0,0],
	["browsing",Date.now(),100000000000000],
	["browsing",Date.now()-24*60*60*1000,0],
	["browsing",Date.now()-2*24*60*60*1000,0],
	["browsing",Date.now()-8*24*60*60*1000,0],
	["browsing",Date.now()-18*24*60*60*1000,0],
	["browsing",Date.now()-40*24*60*60*1000,0]
];
var workTimes:WorkTime[] = workTimesJSON.map(v=>WorkTime.createFromJSON(v));

export function activate(context: vscode.ExtensionContext) {
	const dump = new DisposableRegistrar(context);


	timesTreeProvider = new WorkTimesTreeProvider(workTimes);

	dump.add(vscode.window.registerTreeDataProvider("apc-times",timesTreeProvider));
	timesTreeView = vscode.window.createTreeView("apc-times", {treeDataProvider:timesTreeProvider});
	

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
