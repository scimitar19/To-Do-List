   export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
