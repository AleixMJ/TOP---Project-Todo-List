import Todo from "./todo";
import "./styles.css";

const todoDefault = new Todo(
  "Example Todo",
  "This is an example todo item.",
  "2024-12-31",
  "High",
  "These are some notes for the example todo.",
  ["Task 1", "Task 2", "Task 3"]
);

const todoContainer = document.querySelector(".todo-container");
todoContainer.innerHTML = todoDefault.Display();
