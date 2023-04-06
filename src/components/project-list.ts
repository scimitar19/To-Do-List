import Component from "./component.js";
import {Project, Status} from "../models/project.js";
import {DragTarget} from "../models/drag-drop.js";
import {Autobind} from "../decorators/autobind.js";
import {projectState} from "../state/project-state.js";
import {ProjectItem} from "./project-item.js"

  export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
      super("project-list", "app", false, `${type}-projects`);
      this.assignedProjects = [];
      this.config();
      this.renderContent();
    }

    @Autobind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] == "text/plain") {
        event.preventDefault();
        const listBoxes = this.element.querySelector("ul")!;
        listBoxes.classList.add("droppable");
      }
    }
    //////////////////////////////////////
    @Autobind
    dropHandler(event: DragEvent) {
      const prjId = event.dataTransfer!.getData("text/plain");
      projectState.switchProject(
        prjId,
        this.type === "active" ? Status.ACTIVE : Status.FINISHED
      );
      console.log(event);
    }
    @Autobind
    dragLeaveHandler(event: DragEvent) {
      const listBoxes = this.element.querySelector("ul")!;
      listBoxes.classList.remove("droppable");
    }

    config() {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);

      projectState.addListener((projects: Project[]) => {
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
      this.element.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " Projects";
      this.element.querySelector("ul")!.id = listId;
    }

    private renderProjects() {
      const listEl = document.getElementById(
        `${this.type}-projects-list`
      )! as HTMLUListElement;
      const listElActive = document.getElementById(
        "active-projects-list"
      )! as HTMLUListElement;
      listEl.innerHTML = "";
      for (const prjItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
      }
    }
  }

