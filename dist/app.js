"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Status;
(function (Status) {
    Status[Status["ACTIVE"] = 0] = "ACTIVE";
    Status[Status["FINISHED"] = 1] = "FINISHED";
})(Status || (Status = {}));
class Project {
    constructor(t, d, np, id, ps) {
        this.title = t;
        this.description = d;
        this.numbOfPeople = np;
        this.id = id;
        this.projectStatus = ps;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    addProject(title, description, numbOfPeople) {
        const project = new Project(title, description, numbOfPeople, Math.random().toString(), Status.ACTIVE);
        this.projects = [...this.projects, project];
        console.log(this.projects);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
    static getInstance() {
        if (!ProjectState.instance) {
            ProjectState.instance = new ProjectState();
            return ProjectState.instance;
        }
        else {
            throw new Error("This class has been instantiaded");
        }
    }
}
const projectState = ProjectState.getInstance();
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
function Autobind(target, name, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        },
    };
    return adjDescriptor;
}
class Component {
    constructor(templateId, hostElId, insertAtStart, elId) {
        this.hostElement = document.getElementById(hostElId);
        this.elementTemplate = document.getElementById(templateId);
        const importedNode = document.importNode(this.elementTemplate.content, true);
        this.element = importedNode.firstElementChild;
        if (elId) {
            this.element.id = elId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtStart) {
        this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
    }
}
class ProjectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.config();
        this.renderContent();
    }
    config() {
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter((prj) => {
                if (this.type === "active") {
                    return prj.projectStatus === Status.ACTIVE;
                }
                return prj.projectStatus === Status.FINISHED;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + " Projects";
        this.element.querySelector("ul").id = listId;
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        const listElActive = document.getElementById("active-projects-list");
        listEl.innerHTML = "";
        for (const prjItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = prjItem.title;
            listElActive.appendChild(listItem);
        }
    }
}
// ProjectInput class
class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.titleInputEl = this.element.querySelector("#title");
        this.descriptionInputEl = this.element.querySelector("#description");
        this.peopleInputEl = this.element.querySelector("#people");
        this.config();
    }
    config() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    renderContent() { }
    gatherUserInput() {
        const t = this.titleInputEl.value;
        const d = this.descriptionInputEl.value;
        const p = this.peopleInputEl.value;
        // Objects to validate
        const titleToVal = {
            value: t,
            required: true,
        };
        const descriptionToVal = {
            value: d,
            required: true,
            minLength: 5,
        };
        const peopleToVal = {
            value: +p,
            required: true,
            min: 1,
            max: 5,
        };
        if (!Validate(titleToVal) ||
            !Validate(descriptionToVal) ||
            !Validate(peopleToVal)) {
            alert("Invalid input please try again!");
            return;
        }
        else {
            return [t, d, +p];
        }
    }
    clearInputs() {
        this.titleInputEl.value = "";
        this.descriptionInputEl.value = "";
        this.peopleInputEl.value = "";
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            /////////////////////// insert project code
            console.log(title, description, people);
            projectState.addProject(title, description, people);
            this.clearInputs();
        }
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
const trigger = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
