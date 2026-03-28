export default class Todo {
  constructor(title, description, dueDate, priority, notes, checklist = []) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
    this.completed = false;
    this.id = crypto.randomUUID();

  }


    Display() {

    return `
      <div class="todo-item" data-id="${this.id}">
        <div class="todo-header">
            <h2>${this.title}</h2>
            <div class="todo-actions">
                <button class="expand-btn">+</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">X</button>
            </div> 
        </div>  

        <div class="todo-content" style="display: none;">
          ${this.description ? `<p>${this.description}</p>` : ''}
          <p><strong>Due:</strong> ${this.dueDate || '—'}</p>
          <p><strong>Priority:</strong> ${this.priority || 'Medium'}</p>
          ${this.notes ? `<p><strong>Notes:</strong> ${this.notes}</p>` : ''}

          ${this.checklist.length > 0 ? `
            <ul class="checklist">
              ${this.checklist.map(item => `
                <li>
                  <label class="check-button">
                    <input type="checkbox">
                    <span>${item}</span>
                  </label>
                </li>
              `).join('')}
            </ul>
          ` : ''}
        </div>   
      </div>
    `;
  }
}