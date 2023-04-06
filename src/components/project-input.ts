import Component from "./component.js"
import * as Validation from "../util/validation.js"
import {Autobind as AUTOBIND} from "../decorators/autobind.js"
import {projectState} from "../state/project-state.js"

   export class ProjectInput extends Component<HTMLDivElement, HTMLElement> {
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
          const titleToVal: Validation.Val = {
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
            !Validation.Validate(titleToVal) ||
            !Validation.Validate(descriptionToVal) ||
            !Validation.Validate(peopleToVal)
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
        
        @AUTOBIND
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
