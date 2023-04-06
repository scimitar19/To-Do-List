export var Status;
(function (Status) {
    Status[Status["ACTIVE"] = 0] = "ACTIVE";
    Status[Status["FINISHED"] = 1] = "FINISHED";
})(Status || (Status = {}));
export class Project {
    constructor(t, d, np, id, ps) {
        this.title = t;
        this.description = d;
        this.numbOfPeople = np;
        this.id = id;
        this.projectStatus = ps;
    }
}
