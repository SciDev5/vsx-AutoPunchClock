import * as vscode from "vscode";
import { WorkSummaryRangeItem } from "./SummaryRangeItem";
import { WorkInstanceTreeItem } from "./WorkTimeItem";
import { MILLIS_IN_DAY, NUM_DAYS_UNTIL_OLD, NUM_DAYS_IN_WEEK, NUM_WEEKS_UNTIL_COMBINE, ChildWieldingItem, WorkTimesTreeItem, WorkTimesTreeProvider } from "./WorkTimesTreeProvider";

export class TimeRangeItem extends vscode.TreeItem implements ChildWieldingItem {
    readonly dateStart: Date;
    readonly dateEnd: Date;
    readonly daysSince: number;
    constructor(daysSince: number, start: Date, end: Date) {
        super(TimeRangeItem.getLabel(daysSince, start), vscode.TreeItemCollapsibleState.Collapsed);
        this.dateStart = start;
        this.dateEnd = end;
        this.daysSince = daysSince;
    }

    static getLabel(daysSince: number, start: Date): string {
        const startDate = new Date(start.getTime() + 60000 * start.getTimezoneOffset() + MILLIS_IN_DAY / 2);
        if (daysSince === 0)
            return "Today";
        if (daysSince === 1)
            return "Yesterday";
        if (daysSince >= NUM_DAYS_UNTIL_OLD)
            return startDate.toLocaleDateString(undefined, { day: "numeric", month: "numeric", year: "numeric" });
        if (daysSince >= NUM_DAYS_IN_WEEK * NUM_WEEKS_UNTIL_COMBINE)
            return `${daysSince / 7} Weeks Ago`;
        if (daysSince < NUM_DAYS_IN_WEEK)
            return `${daysSince} Days Ago (${startDate.toLocaleDateString(undefined, { weekday: "short" })})`;
        return `${daysSince} Days Ago`;
    }
    
    getChildren(provider: WorkTimesTreeProvider): WorkTimesTreeItem[] {
        var items: WorkTimesTreeItem[] = [];
        items.push(new WorkSummaryRangeItem(this.dateStart,this.dateEnd));
        items.push(...provider.workTimes.filter(v=>v.day>=this.dateStart&&v.day<=this.dateEnd).map(v=>new WorkInstanceTreeItem(v)));
        return items;
    }
}
