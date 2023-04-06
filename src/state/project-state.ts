import {Project, Status} from "../models/project.js";


// Project State Managment
  type Listener<T> = (items: T[]) => void;

  class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn);
    }
  }

  export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
      super();
    }

    addProject(title: string, description: string, numbOfPeople: number) {
      const project: Project = new Project(
        title,
        description,
        numbOfPeople,
        Math.random().toString(),
        Status.ACTIVE
      );
      this.projects = [...this.projects, project];
      this.updateListeners();
    }

    switchProject(prjId: string, newStatus: Status) {
      const altProject = this.projects.find((item) => item.id === prjId);
      if (altProject && altProject.projectStatus !== newStatus) {
        altProject.projectStatus = newStatus;
        this.updateListeners();
      }
    }

    private updateListeners() {
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice());
      }
    }

    static getInstance() {
      if (!ProjectState.instance) {
        ProjectState.instance = new ProjectState();
        return ProjectState.instance;
      } else {
        throw new Error("This class has been instantiaded");
      }
    }
  }
  export const projectState = ProjectState.getInstance();

