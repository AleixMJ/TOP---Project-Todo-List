import Todo from "./todo";
import "./styles.css";
import "./sidebar.css";
import initProjectsSidebar from "./ProjectsSidebar";
import "./dialog.css";




document.addEventListener('DOMContentLoaded', () => {

    // Buttons functionality inside each form

    const todoContainer = document.querySelector('.todo-container');

    if (!todoContainer) {
        console.error('Error: .todo-container element not found in the HTML!');
        return;
    }

    let projects = []
    let currentEditId = null;
    let currentProject = null;

    function renderTodos(project) {
      todoContainer.innerHTML = "";     

      project["todos"].forEach(todo => {
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

      if (e.target.classList.contains('edit-btn')) {
        currentEditId = todoItem.dataset.id;
        const currentEditTodo = currentProject.todos.find(todo => todo.id === currentEditId)
        Array.from(newTaskForm.elements).forEach(input => {
          if (input.name && currentEditTodo[input.name]) {
            input.value = currentEditTodo[input.name];
          }

        });
        document.getElementById("submitTask").textContent = "Update task";
        newTaskDialog.showModal();
      }

      if (e.target.classList.contains('complete-btn')) {
        if (e.target.checked) {
          todoItem.complete = true;
          todoItem.style.opacity = "0.5";
          todoItem.style.textDecoration = "line-through";
        } else {
          todoItem.complete = false;
          todoItem.style.opacity = "1";
          todoItem.style.textDecoration = "none";

        }
      }

    });


  // New Task form pop out logic
  const newTaskDialog = document.getElementById("newTask-creation");
  const newTaskBtn = document.getElementById("newTask-btn");
  const newTaskForm = document.getElementById("newTask-form");
  const closeDialogBtn = document.querySelector(".closeTask-btn");

  closeDialogBtn.addEventListener('click', () => {
    newTaskDialog.close();
  });



  newTaskBtn.addEventListener('click', () => {
    document.getElementById("submitTask").textContent = "Create new task";
    newTaskDialog.showModal();
  });


  // Projects button logic
  const projectsBtn = document.getElementById("projects-btn");
  const containerProjects = document.getElementById("container-projects");
  projectsBtn.addEventListener('click', () => {
    containerProjects.style.left = "0";
  });

  function renderProjects() {
    const existingLinks = containerProjects.querySelectorAll('.project-link');
    existingLinks.forEach(link => link.remove());


    projects.forEach(project => {
      let projectName = document.createElement("p");
      projectName.textContent = project["name"];
      projectName.classList.add("project-link");
      projectName.addEventListener('click', () => {
        containerProjects.style.left = "-200px";
        currentProject = project;
        renderTodos(currentProject);
        document.getElementById("project-name").textContent = project.name;
      })
      containerProjects.appendChild(projectName);
    });
  };

  // Submit handler
  newTaskForm.addEventListener('submit',(e) => {
    e.preventDefault();
   
    if (currentEditId) {
      
      const currentEditTodo = currentProject.todos.find(todo => todo.id === currentEditId)
      console.log(currentEditTodo);
        Array.from(newTaskForm.elements).forEach(input => {
          if (input.name === "checklist") {
            currentEditTodo['checklist'] = 
            input.value ? input.value.split(',').map(item => item.trim()) : []
          } else {
            if (input.name && currentEditTodo[input.name]) {
            currentEditTodo[input.name] = input.value;
          }

          }      


        });
      currentEditId = null;       
    } else {

      const task = Object.fromEntries(new FormData(newTaskForm));
      console.log("new task:", task);
      const newTodo = new Todo(
        task['title'],
        task['description'],
        task['dueDate'],
        task['priority'],
        task['notes'],
        task['checklist'] ? task['checklist'].split(',').map(item => item.trim()) : []
      );

      currentProject.todos.push(newTodo);

    }
    renderTodos(currentProject);
    newTaskForm.reset();
    newTaskDialog.close();
  });

  // Initial render of Todos with example
  let todos = [
    new Todo(
      "Example Todo",
      "This is an example todo item.",
      "2026-05-31",
      "High",
      "These are some notes for the example todo.",
      ["Task 1", "Task 2", "Task 3"]
    )
  ];
  projects.push({ name: "Todo List", todos: todos });
  currentProject = projects[0];
  renderTodos(currentProject);
  renderProjects();

  initProjectsSidebar(projects,renderProjects);
});

