import * as vscode from 'vscode';
import { WorkTimesTreeProvider, WorkTimesTreeItem } from './work-time-tree/WorkTimesTreeProvider';
import { WorkTime, WorkTimeJSON } from './timing/WorkTime';
import { Tracker } from './timing/Tracker';

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
var workTimes:WorkTime[] = [];
var tracker:Tracker;

function onCodeAction() {
	console.log("code action");
	tracker.onCode();
	timesTreeProvider.refresh();
}
function onBrowseAction() {
	console.log("browse action");
	tracker.onBrowse();
	timesTreeProvider.refresh();
}


export function activate(context: vscode.ExtensionContext) {
	const dump = new DisposableRegistrar(context);

	tracker = new Tracker(workTimes);

	timesTreeProvider = new WorkTimesTreeProvider(workTimes);

	dump.add(vscode.window.registerTreeDataProvider("apc-times",timesTreeProvider));
	timesTreeView = vscode.window.createTreeView("apc-times", {treeDataProvider:timesTreeProvider});
	
	// Add events which count as actively coding.
	dump.add(vscode.workspace.onDidChangeTextDocument(onCodeAction));
	dump.add(vscode.workspace.onDidCreateFiles(onCodeAction));
	dump.add(vscode.workspace.onDidDeleteFiles(onCodeAction));
	dump.add(vscode.workspace.onDidRenameFiles(onCodeAction));
	dump.add(vscode.workspace.onDidSaveTextDocument(onCodeAction));

	// Add events which count as browsing the workspace.
	dump.add(vscode.window.onDidChangeActiveTextEditor(onBrowseAction));
	dump.add(vscode.window.onDidChangeTextEditorViewColumn(onBrowseAction));
	dump.add(vscode.window.onDidChangeTextEditorVisibleRanges(onBrowseAction));
	dump.add(vscode.window.onDidChangeTextEditorSelection(onBrowseAction));
	dump.add(vscode.window.onDidChangeVisibleTextEditors(onBrowseAction));
	
	dump.add(vscode.commands.registerCommand('vsx-autopunchclock.showMenu', () => {
		vscode.window.showInformationMessage('Hello World from vsx-autopunchclock!');
	}));
}

export function deactivate() {}
