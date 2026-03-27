import Todo from "./todo";
import "./styles.css";


document.addEventListener('DOMContentLoaded', () => {

    // Buttons functionality inside each form

    const todoContainer = document.querySelector('.todo-container');

    if (!todoContainer) {
        console.error('Error: .todo-container element not found in the HTML!');
        return;
    }

    let todos = [];

    function renderTodos() {
      todoContainer.innerHTML = "";     

      todos.forEach(todo => {
        todoContainer.insertAdjacentHTML('beforeend', todo.Display());
      });
    }



    // Event delegation for todo item buttons
    todoContainer.addEventListener('click', function(e) {
      // 1. Find if a button inside a todo was clicked
      const todoItem = e.target.closest('.todo-item');
      if (!todoItem) return;   // click was outside any todo

      // 2. Handle different buttons
      if (e.target.classList.contains('expand-btn')) {
          const content = todoItem.querySelector('.todo-content');
          const btn = e.target;

          if (content.style.display === 'none' || content.style.display === '') {
              content.style.display = 'block';
              btn.textContent = '−'; 
          } else {
              content.style.display = 'none';
              btn.textContent = '+';
          }
      }

      if (e.target.classList.contains('delete-btn')) {
        todoItem.remove();
      }

    });


  // New Task form pop out logic
  const newTaskDialog = document.getElementById("newTask-creation");
  const newTaskBtn = document.getElementById("newTask-btn");
  const newTaskForm = document.getElementById("newTask-form");

  newTaskBtn.addEventListener('click', () => {
    newTaskDialog.showModal();
  });

  newTaskForm.addEventListener('submit',(e) => {
    e.preventDefault();

    const task = Object.fromEntries(new FormData(newTaskForm));
    console.log("new task:", task);
    const newTodo = new Todo(
      task['task-title'],
      task['task-description'],
      task['task-dueDate'],
      task['task-priority'],
      task['task-notes'],
      task['task-checklist'] ? task['task-checklist'].split(',').map(item => item.trim()) : []
    );

    todos.push(newTodo);
    renderTodos();
    newTaskForm.reset();
    newTaskDialog.close();

  });

  // Initial render of Todos with example
  todos = [
    new Todo(
      "Example Todo",
      "This is an example todo item.",
      "2024-12-31",
      "High",
      "These are some notes for the example todo.",
      ["Task 1", "Task 2", "Task 3"]
    )
  ];
  renderTodos();
});

