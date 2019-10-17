class Model {
  constructor() {
    this.list = JSON.parse(localStorage.getItem('list')) || [{ id: 0, text: "Make coffee ☕️", checked: false},
    { id: 1, text: "Drink coffee ☕️", checked: false}];
  }

  addItem(item) {
    const newItem = {
      id: this.list.length > 0 ? this.list[this.list.length - 1].id + 1 : 1,
      text: item,
      checked: false
    }

    this.list.push(newItem);

    this._commit(this.list);
  }

  editItem(id, newText) {
    this.list = this.list.map(item => item.id === id ? { id: item.id, text: newText, complete: item.complete } : item);

    this._commit(this.list);
  }

  deleteItem(id) {
    this.list = this.list.filter(item => item.id !== id);

    this._commit(this.list);
  }

  toggleCheckOnItem(id) {
    this.list = this.list.map(item => item.id === id ? { id: item.id, text: item.text, complete: !item.complete } : item);

    this._commit(this.list);
  }

  bindListChange(callback) {
    this.onChange = callback;
  }

  _commit(list) {
    this.onChange(list);
    localStorage.setItem('list', JSON.stringify(list));
  }
}

class View {
  constructor() {
    // root
    this.app = this.getDOMelement('#root');

    // title
    this.title = this.createDOMelement('h1', 'lh-title');
    this.title.textContent = 'Checklist App';

    // form with input and submit
    this.form = this.createDOMelement('form');
    this.input = this.createDOMelement('input');
    this.input.type = 'text';
    this.input.placeholder = 'add item';
    this.input.name = 'new item';
    this.submitButton = this.createDOMelement('a');
    this.submitButton.textContent = 'Add to list';

    this.form.append(this.input, this.submitButton);

    // list element
    this.list = this.createDOMelement('ul');
    this.app.append(this.title, this.form, this.list);

    this._temporaryItemText = '';
    this._initLocalListeners();
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

  displayList(list) {
    while (this.list.firstChild) {
      this.list.removeChild(this.list.firstChild);
    }

    if (list.length === 0) {
      const p = this.createDOMelement('p');
      p.textContent = 'Nothing to check here, add some todos!';
      this.list.append(p);
    } else {
      list.forEach(item => {
        const li = this.createDOMelement('li');
        li.id = item.id;

        const checkbox = this.createDOMelement('input', 'mr2');
        checkbox.type = 'checkbox';
        checkbox.checked = item.complete;

        const span = this.createDOMelement('span');
        span.contentEditable = true;
        span.classList.add('editable');

        if (item.complete) {
          const strike = this.createDOMelement('s', 'strike');
          strike.textContent = item.text;
          span.append(strike);
        } else {
          span.textContent = item.text;
        }

        const deleteButton = this.createDOMelement('a');
        deleteButton.textContent = 'Delete';

        li.append(checkbox, span, deleteButton);

        this.list.append(li);
      })
    }
  }

  bindAddItem(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault();

      if (this._itemText) {
        handler(this._itemText);
        this._resetInput();
      }
    });
  }

  bindDeleteItem(handler) {
    this.list.addEventListener('click', event => {
      if (event.target.className === 'delete') {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    });
  }

  bindToggleItem(handler) {
    this.list.addEventListener('change', event => {
      if (event.target.type === 'checkbox') {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    });
  }

  bindEditItem(handler) {
    this.list.addEventListener('focusout', event => {
      if (this._temporaryItemText) {
        const id = parseInt(event.target.parentElement.id);

        handler(id, this._temporaryItemText);
        this._temporaryItemText = '';
      }
    });
  }

  get _itemText() {
    return this.input.value;
  }

  _resetInput() {
    this.input.value = '';
  }

  _initLocalListeners() {
    this.list.addEventListener('input', event => {
      if (event.target.className === 'editable') {
        this._temporaryItemText = event.target.innerText;
      }
    })
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.onChange(this.model.list);
    this.model.bindListChange(this.onChange);
    this.view.bindAddItem(this.handleAddition);
    this.view.bindDeleteItem(this.handleDeletion);
    this.view.bindToggleItem(this.handleToggle);
    this.view.bindEditItem(this.handleEdition);
  }

  onChange = list => {
    this.view.displayList(list);
  }

  // using arrow notation on handlers so that they can be called from the View using this keyword
  // withouth having to add .bind(this)
  handleAddition = text => {
    this.model.addItem(text);
  }

  handleEdition = (id, text) => {
    this.model.editItem(id, text);
  }

  handleDeletion = id => {
    this.model.deleteItem(id);
  }

  handleToggle = id => {
    this.model.toggleCheckOnItem(id);
  }
  
}

const app = new Controller(new Model(), new View());
