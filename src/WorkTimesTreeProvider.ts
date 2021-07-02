import * as vscode from "vscode";
import { WorkTime } from "./timing/WorkTime";

export class WorkTimesTreeProvider implements vscode.TreeDataProvider<WorkTimeTreeItem> {
    workTimes: WorkTime[];
    constructor(workTimes:WorkTime[]) {
        this.workTimes = workTimes;
    }
    getTreeItem(element: WorkTimeTreeItem): vscode.TreeItem { return element }
    getChildren(element?: WorkTimeTreeItem): vscode.ProviderResult<WorkTimeTreeItem[]> {
        if (!element)
            return this.workTimes.map(v=>new TimeRangeTreeItem(v.day,v.day));
        else if (element instanceof TimeRangeTreeItem)
            return this.workTimes.filter(v=>v.day>=element.dateStart&&v.day<=element.dateEnd).map(v=>new WorkTimeTreeItem(v));
        else return [];
    }

    private _onDidChangeTreeData: vscode.EventEmitter<WorkTimeTreeItem | undefined | null | void> = new vscode.EventEmitter<WorkTimeTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<WorkTimeTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;
    refresh(): void { this._onDidChangeTreeData.fire() }
}

export class WorkTimeTreeItem extends vscode.TreeItem {
    constructor(workTime: WorkTime) {
        super(workTime.start.toLocaleTimeString());
    }
}
export class TimeRangeTreeItem extends vscode.TreeItem {
    readonly dateStart: Date;
    readonly dateEnd: Date;
    constructor(start: Date, end: Date) {
        super("YEET: "+new Date(start.getTime()+start.getTimezoneOffset()*60000).toDateString(),vscode.TreeItemCollapsibleState.Collapsed);
        this.dateStart = start;
        this.dateEnd = end;
    }
}