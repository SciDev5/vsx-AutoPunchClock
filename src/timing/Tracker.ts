import { WorkTime, WorkType, WORK_TYPES } from "./WorkTime";


const TIME_UNTIL_IDLE = 300000;

export class Tracker {
    constructor(private readonly times: WorkTime[]) {}
    private lastCodeTime = -Infinity;
    private lastBrowseTime = -Infinity;
    private lastBrowseTimeSinceCode = -Infinity;

    onCode() {
        this.updateExpiry();
        this.lastCodeTime = Date.now();
        this.lastBrowseTimeSinceCode = -Infinity;
        this.updateExpiry();
    }
    onBrowse() {
        this.updateExpiry();
        const now = Date.now()-10, lstse = this.lastBrowseTimeSinceCode;
        this.lastBrowseTime = now;
        this.lastBrowseTimeSinceCode = !isFinite(lstse) || (now-lstse>TIME_UNTIL_IDLE||now-lstse<15) ? now : lstse;
        this.updateExpiry();
    }
    
    updateExpiry() {
        const { currentWorkTime } = WorkTime;
        const mostRecentWork = this.getMostRecentWork();
        const now = Date.now();
        if (currentWorkTime && mostRecentWork.includes(currentWorkTime.type))
            currentWorkTime.end = new Date(now);
        else {
            var startTime = now;
            switch (mostRecentWork[0]) {
                case "coding":
                    if (now - this.lastBrowseTime < TIME_UNTIL_IDLE)
                        startTime = this.lastBrowseTime;
                    break;
                case "browsing":
                    if (now - this.lastBrowseTimeSinceCode < TIME_UNTIL_IDLE)
                        startTime = this.lastBrowseTime;
                    break;
                case "idle":
                    if (isFinite(this.lastBrowseTime) || isFinite(this.lastCodeTime))
                        startTime = Math.max(this.lastCodeTime,this.lastBrowseTime);
                    break;
                default: break;
            }
            this.times.push(WorkTime.createCurrent(mostRecentWork[0],new Date(startTime)));
        }
    }
    getMostRecentWork(): WorkType[] {
        const now = Date.now();
        const timeSinceCode = now-this.lastCodeTime, timeSinceBrowse = now-this.lastBrowseTime;
        const wasCodingLast = timeSinceCode < timeSinceBrowse;
        if (timeSinceCode > TIME_UNTIL_IDLE && timeSinceBrowse > TIME_UNTIL_IDLE)
            return ["idle"];
        if (wasCodingLast)
            return ["coding"];
        else if (timeSinceCode < TIME_UNTIL_IDLE)
            return ["browsing","coding"];
        else
            return ["browsing"];
    }
}