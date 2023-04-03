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
    console.log(this.projects);
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

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];
    this.config();
    this.renderContent();
  }

  config() {
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
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listElActive.appendChild(listItem);
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
