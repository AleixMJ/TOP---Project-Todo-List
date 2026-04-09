import "./sidebar.css";

export default function initProjectsSidebar(projects, renderProjectsCallback) {
  const showInputBtn = document.getElementById("show-input-btn");
  const inputSection = document.getElementById("input-section");
  const addBtn = document.getElementById("add-project-confirm");
  const projectNameInput = document.getElementById("new-project-name");
  const cancelBtn = document.getElementById("cancel-project-btn");

  showInputBtn.addEventListener("click", () => {
    showInputBtn.classList.add("hidden");
    inputSection.classList.remove("hidden");
    projectNameInput.focus();
  });

  addBtn.addEventListener("click", () => {
    const name = projectNameInput.value.trim();
    if (name) {
      projects.push({ name: name, todos: [] });
      renderProjectsCallback();

      projectNameInput.value = "";
      showInputBtn.classList.remove("hidden");
      inputSection.classList.add("hidden");
    }
  });

  cancelBtn.addEventListener("click", () => {
    if (projectNameInput) {
      projectNameInput.value = "";
    }

    showInputBtn.classList.remove("hidden");
    inputSection.classList.add("hidden");
  });
}
