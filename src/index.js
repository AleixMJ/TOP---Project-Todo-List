import Todo from "./todo";
import "./styles.css";
import "./sidebar.css";
import "./dialog.css";
import "./header.css";
import initProjectsSidebar from "./ProjectsSidebar";
import { de } from "date-fns/locale";

// State variables
let projects = []
let currentEditId = null;
let currentProject = null;
const todoContainer = document.querySelector('.todo-container');
const containerProjects = document.getElementById("container-projects");


// localStorage handling
function saveToLocalStorage() {
  localStorage.setItem('taskly_projects', JSON.stringify(projects));
}

function loadFromLocalStorage() {
  const savedProjects = localStorage.getItem('taskly_projects');
  if (savedProjects) {
    const parsedProjects = JSON.parse(savedProjects)
    projects = parsedProjects.map(project => {
      project.todos = project.todos.map(t =>
        new Todo(t.title, t.description, t.dueDate, t.priority, t.notes, t.checklist, t.id, t.completed)
      );
      return project;
    });
  } else {
    createTemplate(todoContainer);
  }
}
// Rendering functions
function renderTodos(project, container) {
 container.innerHTML = "";     

  project["todos"].forEach(todo => {
    container.insertAdjacentHTML('beforeend', todo.Display());
  });
}

function renderProjects(sidebarProjects, container) {
  const existingWrappers = sidebarProjects.querySelectorAll('.project-wrapper');
  existingWrappers.forEach(link => link.remove());


  projects.forEach((project, index) => {
    const projectWrapper = document.createElement("div");
    projectWrapper.classList.add("project-wrapper");

    let projectName = document.createElement("p");
    projectName.textContent = project["name"];
    projectName.classList.add("project-link");
    projectName.addEventListener('click', () => {
      sidebarProjects.style.left = "-260px";
      currentProject = project;
      renderTodos(currentProject, container);
      document.getElementById("project-name").textContent = project.name;
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-project-btn");
    
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      projects.splice(index, 1);

      if (projects.length === 0) {
        createTemplate(todoContainer);
      } else {
        currentProject = projects[0];
        renderTodos(currentProject, todoContainer);
        document.getElementById("project-name").textContent = currentProject.name;
    }
      saveToLocalStorage();
      renderProjects(containerProjects, todoContainer);
    });
    

    projectWrapper.appendChild(projectName);
    projectWrapper.appendChild(deleteBtn);
    sidebarProjects.appendChild(projectWrapper);
  });
};

function createTemplate(container) {
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
  renderTodos(currentProject, container);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {

    // Buttons functionality inside each form
    

    if (!todoContainer) {
        console.error('Error: .todo-container element not found in the HTML!');
        return;
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
        const todoId = todoItem.dataset.id;
        currentProject.todos = currentProject.todos.filter(todo => todo.id !== todoId);
        saveToLocalStorage();
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
  projectsBtn.addEventListener('click', () => {
    containerProjects.style.left = "0";
  });



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
    saveToLocalStorage();
    renderTodos(currentProject, todoContainer);
    newTaskForm.reset();
    newTaskDialog.close();
  });

  // Initial render of Todos with example
  loadFromLocalStorage();
  currentProject = projects[0];
  renderTodos(currentProject, todoContainer);
  renderProjects(containerProjects, todoContainer);
  if (currentProject) {
    document.getElementById("project-name").textContent = currentProject.name;
  }

  initProjectsSidebar(projects, () => renderProjects(containerProjects, todoContainer));
});

