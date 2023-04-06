var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from "./component.js";
import * as Validation from "../util/validation.js";
import { Autobind as AUTOBIND } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
export class ProjectInput extends Component {
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
        if (!Validation.Validate(titleToVal) ||
            !Validation.Validate(descriptionToVal) ||
            !Validation.Validate(peopleToVal)) {
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
    AUTOBIND
], ProjectInput.prototype, "submitHandler", null);
