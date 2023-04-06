var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from "./component.js";
import { Status } from "../models/project.js";
import { Autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
import { ProjectItem } from "./project-item.js";
export class ProjectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.config();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] == "text/plain") {
            event.preventDefault();
            const listBoxes = this.element.querySelector("ul");
            listBoxes.classList.add("droppable");
        }
    }
    //////////////////////////////////////
    dropHandler(event) {
        const prjId = event.dataTransfer.getData("text/plain");
        projectState.switchProject(prjId, this.type === "active" ? Status.ACTIVE : Status.FINISHED);
        console.log(event);
    }
    dragLeaveHandler(event) {
        const listBoxes = this.element.querySelector("ul");
        listBoxes.classList.remove("droppable");
    }
    config() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);
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
            new ProjectItem(this.element.querySelector("ul").id, prjItem);
        }
    }
}
__decorate([
    Autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dropHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dragLeaveHandler", null);
