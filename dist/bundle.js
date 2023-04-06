"use strict";
var App;
(function (App) {
    function Validate(objV) {
        let isValid = true;
        if (objV.required) {
            isValid = isValid && objV.value.toString().trim().length !== 0;
        }
        if (objV.minLength != null && typeof objV.value === "string") {
            isValid = isValid && objV.value.length >= objV.minLength;
        }
        // maxLength
        if (objV.required) {
            isValid = isValid && objV.value.toString().trim().length !== 0;
        }
        if (objV.maxLength != null && typeof objV.value === "string") {
            isValid = isValid && objV.value.length <= objV.maxLength;
        }
        // validation for number
        if (objV.required && objV.min != null && typeof objV.value === "number") {
            isValid = isValid && objV.value >= objV.min;
        }
        if (objV.required && objV.max != null && typeof objV.value === "number") {
            isValid = isValid && objV.value <= objV.max;
        }
        return isValid;
    }
    App.Validate = Validate;
})(App || (App = {}));
var App;
(function (App) {
    let Status;
    (function (Status) {
        Status[Status["ACTIVE"] = 0] = "ACTIVE";
        Status[Status["FINISHED"] = 1] = "FINISHED";
    })(Status = App.Status || (App.Status = {}));
    class Project {
        constructor(t, d, np, id, ps) {
            this.title = t;
            this.description = d;
            this.numbOfPeople = np;
            this.id = id;
            this.projectStatus = ps;
        }
    }
    App.Project = Project;
})(App || (App = {}));
