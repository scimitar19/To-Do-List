export default class Component {
    constructor(templateId, hostElId, insertAtStart, elId) {
        this.hostElement = document.getElementById(hostElId);
        this.elementTemplate = document.getElementById(templateId);
        const importedNode = document.importNode(this.elementTemplate.content, true);
        this.element = importedNode.firstElementChild;
        if (elId) {
            this.element.id = elId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtStart) {
        this.hostElement.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.element);
    }
}
