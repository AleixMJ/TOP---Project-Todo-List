export default class Todo {
  constructor(title, description, dueDate, priority, notes, checklist) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
    this.completed = false;
  }

  Display() {
    return `
      <div class="todo-item">
        <h2>${this.title}</h2>
        <p>${this.description}</p>
        <p>Due Date: ${this.dueDate}</p>
        <p>Priority: ${this.priority}</p>
        <p>Notes: ${this.notes}</p>
        <ul>
          ${this.checklist.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `;
  }
}