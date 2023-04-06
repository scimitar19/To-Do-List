import { Project, Status } from "../models/project.js";
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    addProject(title, description, numbOfPeople) {
        const project = new Project(title, description, numbOfPeople, Math.random().toString(), Status.ACTIVE);
        this.projects = [...this.projects, project];
        this.updateListeners();
    }
    switchProject(prjId, newStatus) {
        const altProject = this.projects.find((item) => item.id === prjId);
        if (altProject && altProject.projectStatus !== newStatus) {
            altProject.projectStatus = newStatus;
            this.updateListeners();
        }
    }
    updateListeners() {
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
export const projectState = ProjectState.getInstance();
