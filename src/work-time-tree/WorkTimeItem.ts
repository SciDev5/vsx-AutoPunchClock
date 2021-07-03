import * as vscode from "vscode";
import { WorkTime } from "../timing/WorkTime";
import { ChildWieldingItem, WorkTimesTreeItem, WorkTimesTreeProvider } from "./WorkTimesTreeProvider";

export class WorkInstanceTreeItem extends vscode.TreeItem implements ChildWieldingItem {
    constructor(workTime: WorkTime) {
        super(workTime.start.toLocaleTimeString());
    }

    getChildren(provider: WorkTimesTreeProvider): WorkTimesTreeItem[] {
        return [];
    }
}