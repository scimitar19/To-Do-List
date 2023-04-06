import {Draggable} from "../models/drag-drop.js";
import Component from "./component.js"
import {Autobind} from "../decorators/autobind.js"
import {Project} from "../models/project.js"

   export class ProjectItem extends Component <HTMLDivElement, HTMLElement> implements Draggable  {
        private project: Project;
      
        get person() {
          const people = this.project.numbOfPeople.toString()
          if(people === "1") {
            return `${people} Person assigned` 
          }
          return `${people} Persons assigned`
        }
      
        constructor(hostId: string, project: Project) {
          super("single-project", hostId, false, project.id)
          this.project = project;
          
          this.config();
          this.renderContent();
        }
        
        @Autobind
        dragStartHandler(event: DragEvent) {
          event.dataTransfer!.setData("text/plain", this.project.id);
          event.dataTransfer!.effectAllowed = "move"
          console.log("Drag start")
        }
        
        @Autobind
        dragEndHandler(event: DragEvent) {
          console.log("Drag end")
        }
        
        config() {
          this.element.addEventListener("dragstart", this.dragStartHandler);
          this.element.addEventListener("dragend", this.dragEndHandler);
        }
        renderContent() {
          this.element.querySelector("h2")!.textContent = this.project.title;
          this.element.querySelector("h3")!.textContent = this.person;
          this.element.querySelector("p")!.textContent = this.project.description;
        }
      }
