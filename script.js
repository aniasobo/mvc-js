class Model {
  constructor() {
    this.list = [
      { id: 0, text: "Make coffee ☕️", checked: false},
      { id: 1, text: "Drink coffee ☕️", checked: false},
    ]
  }

  addItem(item) {
    const newItem = {
      id: this.list.length > 0 ? this.list[this.list.length - 1].id + 1 : 1,
      text: item,
      checked: false
    }

    this.list.push(newItem);
  }

  editItem(id, newText) {
    this.list = this.list.map(item => item.id === id ? { id: item.id, text: newText, complete: item.complete } : item);
  }

  deleteItem(id) {
    this.list = this.list.filter(item => item.id !== id);
  }

  toggleCheckOnItem(id) {
    this.list = this.list.map(item => item.id === id ? { id: item.id, text: item.text, complete: !item.complete } : item);
  }
}

class View {
  constructor() {
    // root
    this.app = this.getDOMelement('#root');

    // title
    this.title = this.createDOMelement('h1');
    this.title.textContent = 'Checklist App';

    // form with input and submit
    this.form = this.createDOMelement('form');
    this.input = this.createDOMelement('input');
    this.input.type = 'text';
    this.input.placeholder = 'add item';
    this.input.name = 'new item';
    this.submitButton = this.createDOMelement('button');
    this.submitButton.textContent = 'Add to list';

    this.form.append(this.input, this.submitButton);

    // list element
    this.itemList = this.createDOMelement('ul', 'checklist');

    this.app.append(this.title, this.form, this.itemList);
  }

  createDOMelement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  getDOMelement(selector) {
    const element = document.querySelector(selector);

    return element;
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const app = new Controller(new Model(), new View());