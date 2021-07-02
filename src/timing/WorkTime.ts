export const WORK_TYPES = ["coding","browsing","idle"] as const;
export type WorkType = typeof WORK_TYPES[number];

export type WorkTimeJSON = [WorkType,number,number];

export class WorkTime {
    /** The kind of work the user was doing. */
    readonly type: WorkType;
    private readonly time: {start:Date, end?:Date};
    /** Create a new WorkTime. */
    private constructor(workType:WorkType, start:Date, end?:Date) {
        this.type = workType;
        this.time = {start, end};
    }

    getTime(which:"start"|"end"): Date | undefined { return this.time[which] }
    get start() { return this.time.start }
    get end() { return this.time.end || new Date() }
    get endIsNow() { return this.time.end === undefined }
    
    /** The length of time the user was working. */
    get length() { return (this.time.end || new Date()).getTime() - this.time.start.getTime() }
    
    /** Get the current WorkTime the user is being timed using. */
    static get currentWorkTime() { return this._currentWorkTime }
    private static _currentWorkTime: WorkTime;
    /** Create and set the currently working time stretch. */
    static createCurrent(type:WorkType,start:Date =new Date()): WorkTime {
        if (this._currentWorkTime) {
            if (this._currentWorkTime.type !== type) {
                this._currentWorkTime.time.end = start;
                this._currentWorkTime = new WorkTime(type,start);
            }
        } else this._currentWorkTime = new WorkTime(type,start);
        return this._currentWorkTime;
    }

    /** Create a WorkTime from the json format. */
    static createFromJSON(json: WorkTimeJSON): WorkTime {
        let [type,start,end] = json;
        return new WorkTime(type,new Date(start),new Date(end));
    }
    /** Get the json representation of this WorkTime. */
    toJSON(): WorkTimeJSON {
        return [
            this.type,
            this.time.start.getTime(),
            this.time.end?this.time.end.getTime():Date.now()
        ];
    }

    /** Get the day of the start of a workTime */
    get day(): Date {
        var dateRel = new Date(this.time.start.toDateString());
        return new Date(dateRel.getTime()-dateRel.getTimezoneOffset()*60000);
    }
}
