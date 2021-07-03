import * as vscode from "vscode";
import { WORK_TYPES } from "../timing/WorkTime";
import { WorkSummaryItem } from "./SummaryItem";
import { ChildWieldingItem, WorkTimesTreeItem, WorkTimesTreeProvider } from "./WorkTimesTreeProvider";

export class WorkSummaryRangeItem extends vscode.TreeItem implements ChildWieldingItem {
    constructor(public readonly start: Date, public readonly end: Date) { super("Work Summary", vscode.TreeItemCollapsibleState.Collapsed) }

    getChildren(provider: WorkTimesTreeProvider): WorkTimesTreeItem[] {
        var workTimes = provider.workTimes.filter(v=>v.day>=this.start&&v.day<=this.end);
        var items: WorkTimesTreeItem[] = [];
        for (let workType of WORK_TYPES)
            items.push(new WorkSummaryItem(workTimes.filter(v=>v.type===workType).reduce((n,v)=>n+v.length,0),workType));
        return items;
    }
}