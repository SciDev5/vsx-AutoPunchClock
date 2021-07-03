import * as vscode from "vscode";
import { WorkType } from "../timing/WorkTime";
import { ChildWieldingItem, WorkTimesTreeItem, WorkTimesTreeProvider } from "./WorkTimesTreeProvider";

export class WorkSummaryItem extends vscode.TreeItem implements ChildWieldingItem {
    constructor(time: number, type: WorkType) { super(WorkSummaryItem.getLabel(time, type)) }

    static getLabel(millisWorking: number, type: WorkType): string {
        const minutes = Math.floor(millisWorking / 60000), hours = Math.floor(minutes / 60);
        let timeText = "";
        if (millisWorking <= 0)
            timeText = "0";
        else if (minutes === 0)
            timeText = "<1 Min";
        else if (hours < 1)
            timeText = `${minutes} Min`;
        else
            timeText = `${hours} Hr, ${minutes} Min`;
        return `${type}: ${timeText}`;
    }

    getChildren(provider: WorkTimesTreeProvider): WorkTimesTreeItem[] { return [] }
}
