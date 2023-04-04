// Drag & drop interfaces

interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void
    dropHandler(event: DragEvent): void
    dragLeaveHandler(event: DragEvent): void
}

enum Status {
  ACTIVE,
  FINISHED,
}

class Project {
  title: string;
  description: string;
  numbOfPeople: number;
  id: string;
  projectStatus: Status;
  constructor(t: string, d: string, np: number, id: string, ps: Status) {
    this.title = t;
    this.description = d;
    this.numbOfPeople = np;
    this.id = id;
    this.projectStatus = ps;
  }
}

// Project State Managment
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T> []= [];
  
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
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
     const altProject = this.projects.find(item => item.id === prjId)
     if(altProject && altProject.projectStatus !== newStatus) {
      altProject.projectStatus = newStatus;
      this.updateListeners()
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
const projectState = ProjectState.getInstance();

// Validation Logic
interface Val {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function Validate(objV: Val) {
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

function Autobind(target: any, name: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFunction = originalMethod.bind(this);
      return boundFunction;
    },
  };
  return adjDescriptor;
}
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  elementTemplate: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElId: string,
    insertAtStart: boolean,
    elId?: string
  ) {
    this.hostElement = document.getElementById(hostElId) as T;
    this.elementTemplate = document.getElementById(
      templateId
    ) as HTMLTemplateElement;
    const importedNode = document.importNode(
      this.elementTemplate.content,
      true
    )!;
    this.element = importedNode.firstElementChild as U;
    if (elId) {
      this.element.id = elId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }
  abstract config(): void;
  abstract renderContent(): void;
}
// ProjectItem class

class ProjectItem extends Component <HTMLDivElement, HTMLElement> implements Draggable  {
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

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];
    this.config();
    this.renderContent();
  }

  @Autobind 
  dragOverHandler(event: DragEvent) {
    if(event.dataTransfer && event.dataTransfer.types[0] == "text/plain") {
      event.preventDefault();
      const listBoxes = this.element.querySelector("ul")!;
      listBoxes.classList.add("droppable");
    }
  }
//////////////////////////////////////
  @Autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData("text/plain")
    projectState.switchProject(prjId, this.type === 'active' ? Status.ACTIVE : Status.FINISHED)
    console.log(event)
  }
  @Autobind
  dragLeaveHandler(event: DragEvent) {
    const listBoxes = this.element.querySelector("ul")!
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
    // this.assignedProjects = [...this.assignedProjects]
    for (const prjItem of this.assignedProjects) {
       new ProjectItem(this.element.querySelector("ul")!.id, prjItem)
    }
  }
}

// ProjectInput class
class ProjectInput extends Component<HTMLDivElement, HTMLElement> {
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputEl = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputEl = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputEl = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.config();
  }

  config() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const t = this.titleInputEl.value;
    const d = this.descriptionInputEl.value;
    const p = this.peopleInputEl.value;
    // Objects to validate
    const titleToVal: Val = {
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
    if (
      !Validate(titleToVal) ||
      !Validate(descriptionToVal) ||
      !Validate(peopleToVal)
    ) {
      alert("Invalid input please try again!");
      return;
    } else {
      return [t, d, +p];
    }
  }

  private clearInputs() {
    this.titleInputEl.value = "";
    this.descriptionInputEl.value = "";
    this.peopleInputEl.value = "";
  }

  @Autobind
  private submitHandler(event: Event) {
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
const trigger = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
