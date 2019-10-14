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
  constructor() {}
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const app = new Controller(new Model(), new View());