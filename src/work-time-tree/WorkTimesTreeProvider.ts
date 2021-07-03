import * as vscode from "vscode";
import { WorkTime, WORK_TYPES } from "../timing/WorkTime";
import { TimeRangeItem } from "./TimeRangeItem";
import { WorkInstanceTreeItem } from "./WorkTimeItem";
import { WorkSummaryRangeItem } from "./SummaryRangeItem";
import { WorkSummaryItem } from "./SummaryItem";

export const NUM_WEEKS_UNTIL_COMBINE = 2;
export const NUM_DAYS_IN_WEEK = 7;
export const MILLIS_IN_DAY = 86400000;
export const NUM_DAYS_UNTIL_OLD = 40;

export type WorkTimesTreeItem = WorkInstanceTreeItem|TimeRangeItem|WorkSummaryRangeItem|WorkSummaryItem;

type WorkTimesTreeItemNullable = WorkTimesTreeItem|undefined|null|void;

export interface ChildWieldingItem {
    getChildren(provider: WorkTimesTreeProvider): WorkTimesTreeItem[];
}

export class WorkTimesTreeProvider implements vscode.TreeDataProvider<WorkTimesTreeItem> {
    workTimes: WorkTime[];
    constructor(workTimes:WorkTime[]) {
        this.workTimes = workTimes;
    }
    getTreeItem(element: WorkTimesTreeItem): vscode.TreeItem { return element }
    getChildren(element?: WorkTimesTreeItem): vscode.ProviderResult<WorkTimesTreeItem[]> {
        if (element)
            return element.getChildren(this);
        else
            return this.getRootElements();
    }

    getRootElements(): WorkTimesTreeItem[] {
        var today = new Date(new Date().toDateString()); today = new Date(today.getTime()-today.getTimezoneOffset()*60000);
        var days:number[] = [];
        for (let day of this.workTimes.map(v=>v.day)) {
            let daysSince = Math.round((today.getTime()-day.getTime())/MILLIS_IN_DAY);
            if (daysSince >= NUM_DAYS_IN_WEEK*NUM_WEEKS_UNTIL_COMBINE && daysSince < NUM_DAYS_UNTIL_OLD)
                daysSince -= daysSince % NUM_DAYS_IN_WEEK;
            if (!days.includes(daysSince)) days.push(daysSince);
        }
        days.sort((a,b)=>a-b);
        var items: WorkTimesTreeItem[] = [];
        {
            let timeStart = today.getTime()-((days[days.length-1]+0.5)*MILLIS_IN_DAY), 
                timeEnd   = today.getTime()-((days[0]-0.5)*MILLIS_IN_DAY);
            items.push(new WorkSummaryRangeItem(new Date(timeStart),new Date(timeEnd)));
        }
        for (let day of days) {
            let timeStart = today.getTime()-((day+0.5)*MILLIS_IN_DAY), 
                timeEnd   = today.getTime()-((day-0.5)*MILLIS_IN_DAY);
            if (day >= NUM_DAYS_IN_WEEK*NUM_WEEKS_UNTIL_COMBINE && day < NUM_DAYS_UNTIL_OLD)
                timeStart -= NUM_DAYS_IN_WEEK*MILLIS_IN_DAY;
            items.push(new TimeRangeItem(day,new Date(timeStart),new Date(timeEnd)));
        }
        return items;
    }

    private _onDidChangeTreeData: vscode.EventEmitter<WorkTimesTreeItemNullable> = new vscode.EventEmitter<WorkTimesTreeItemNullable>();
    readonly onDidChangeTreeData: vscode.Event<WorkTimesTreeItemNullable> = this._onDidChangeTreeData.event;
    refresh(): void { this._onDidChangeTreeData.fire() }
}