'use strict';

// Initial fake data
const initialState = {
  mode: '',
  filters: [
    {
      name: 'All',
      filter: 'all',
      active: true,
    },
    {
      name: 'Active',
      filter: 'active',
      active: false,
    },
    {
      name: 'Completed',
      filter: 'completed',
      active: false,
    },
  ],
  todo: [
    {
      id: '1',
      name: 'Complete online JavaScript course',
      done: true,
    },
    {
      id: '2',
      name: 'Jog around the park 3x',
      done: true,
    },
    {
      id: '3',
      name: '10 minutes meditation',
      done: true,
    },
    {
      id: '4',
      name: 'Read for 1 hour',
      done: true,
    },
    {
      id: '5',
      name: 'Clear Completed task',
      done: false,
    },
  ],
};

const state = JSON.parse(localStorage.getItem('todo')) || initialState;

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const btnToggleMode = document.getElementById('toggle-mode');
  const todoForm = document.querySelector('.todo form');
  const todoInput = document.getElementById('todo-input');
  const todoListItems = document.getElementById('todo-list-items');
  const todoListCounter = document.querySelector('.todo-list__counter');
  const btnClearCompleted = document.getElementById('clearCompleted');
  const filtersContainer = document.querySelector('.todo-list__filters');

  const updateStorageAndRender = () => {
    localStorage.setItem('todo', JSON.stringify(state));
    render();
  };

  // CRUD
  // add todo
  const addTodo = name => {
    const newTodo = {
      id: Date.now() + Math.random(),
      name,
      done: false,
    };

    state.todo.unshift(newTodo);
    updateStorageAndRender();
  };

  // update status
  const toggleStatus = id => {
    const index = state.todo.findIndex(item => item.id == id);
    state.todo[index].done = !state.todo[index].done;

    updateStorageAndRender();
  };

  // remove todo
  const removeTodo = id => {
    state.todo = state.todo.filter(todo => todo.id != id);

    updateStorageAndRender();
  };

  // return number of not completed tasks
  const numberOfNotCompleted = () =>
    state.todo.filter(todo => !todo.done).length;

  const filterTodo = () => {
    let items = state.todo;

    const active = state.filters.find(filter => filter.active);

    if (active) {
      if (active.filter === 'active') {
        items = state.todo.filter(todo => !todo.done);
      }

      if (active.filter === 'completed') {
        items = state.todo.filter(todo => todo.done);
      }
    }

    return items;
  };

  // RENDER UI FUNCTIONS
  const render = () => {
    const items = filterTodo();
    clearUi();
    todoListItems.insertAdjacentHTML('afterbegin', renderTodoItems(items));
    todoListCounter.textContent = `${numberOfNotCompleted()} items left`;
    filtersContainer.insertAdjacentHTML('afterbegin', renderFilters());
  };

  const renderTodoItems = items => {
    if (!items || items.length === 0) {
      return '<li class="todo__item todo__item--null">There are no items to display</li>';
    }

    return items
      .map(todo => {
        const { id, name, done } = todo;

        return `
            <li class="todo__item ${
              done ? 'todo__item--done' : ''
            } " data-id="${id}">
                <label for="todo-${id}">
                    <input type="checkbox" class="checkbox sr-only" id="todo-${id}" ${
          done ? 'checked' : ''
        }></input>
                    <span class="fake-checkbox-wrapper">
                        <span class="fake-checkbox">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
                        </span>
                    </span>
                    <span class="todo__item__name">${name}</span>
                </label>
                <button type="button" class="btn btn--delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
                </button>
            </li>
        `;
      })
      .join('');
  };

  const renderFilters = () => {
    return state.filters
      .map(btn => {
        const { name, filter, active } = btn;
        return `<button type="button" data-filter="${filter}" class="btn btn--filter ${
          active ? 'is-active' : ''
        }">${name}</button>`;
      })
      .join('');
  };

  const clearUi = () => {
    todoInput.value = '';
    todoListItems.innerHTML = '';
    todoListCounter.innerHTML = '';
    filtersContainer.innerHTML = '';
  };

  // HANDLE FUNCTIONS
  // toggle theme mode
  const handleToggleMode = () => body.classList.toggle('light-mode');

  // submit new todo
  const handleSubmitTodo = e => {
    e.preventDefault();
    addTodo(todoInput.value);
  };

  // toggle todo status
  const handleToggleStatus = e => {
    if (e.target.id === 'todo-input') {
      return;
    }
    const id = e.target.id.split('-')[1];

    toggleStatus(id);
  };

  // remove todo
  const handleRemoveTodo = e => {
    if (!e.target.closest('button')) {
      return;
    }

    const id = e.target.closest('button').parentElement.dataset.id;
    removeTodo(id);
  };

  // remove all completed todo
  const handleRemoveCompleted = () => {
    state.todo = state.todo.filter(todo => !todo.done);

    updateStorageAndRender();
  };

  // handle buttons filter click
  const handleFilters = e => {
    if (e.target.tagName === 'BUTTON') {
      const filter = e.target.dataset.filter;
      state.filters.forEach(item => {
        item.active = item.filter === filter ? true : false;
      });

      updateStorageAndRender();
    }
  };

  // EVENTS
  // toggle theme
  btnToggleMode.addEventListener('click', handleToggleMode);
  // Add new todo
  todoForm.addEventListener('submit', handleSubmitTodo);
  // change todo status
  todoForm.addEventListener('change', handleToggleStatus);
  // remove todo
  todoListItems.addEventListener('click', handleRemoveTodo);
  // remove all completed
  btnClearCompleted.addEventListener('click', handleRemoveCompleted);
  // filters
  filtersContainer.addEventListener('click', handleFilters);

  // RENDER APPLICATION
  updateStorageAndRender();
});
