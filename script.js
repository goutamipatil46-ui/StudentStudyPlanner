const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const subject = document.getElementById("subject");
const deadline = document.getElementById("deadline");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const message = document.getElementById("message");

let tasks = [];
try {
  const savedTasks = JSON.parse(localStorage.getItem("studyTasks") || "[]");
  if (Array.isArray(savedTasks)) {
    tasks = savedTasks.filter(task =>
      task && typeof task.id === "number" &&
      typeof task.name === "string" &&
      typeof task.subject === "string" &&
      typeof task.deadline === "string" &&
      typeof task.completed === "boolean"
    );
  }
} catch (error) {
  tasks = [];
}

function saveTasks() {
  try {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
  } catch (error) {
    message.textContent = "Could not save tasks in this browser.";
  }
}

function updateStats() {
  const completed = tasks.filter(task => task.completed).length;
  document.getElementById("totalTasks").textContent = tasks.length;
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("pendingTasks").textContent = tasks.length - completed;
}

function renderTasks() {
  taskList.replaceChildren();
  const search = searchInput.value.trim().toLowerCase();
  const status = filterStatus.value;
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(search) ||
      task.subject.toLowerCase().includes(search);
    const matchesStatus = status === "all" ||
      (status === "completed" && task.completed) ||
      (status === "pending" && !task.completed);
    return matchesSearch && matchesStatus;
  });

  if (filteredTasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = tasks.length ? "No matching study tasks found." : "No tasks yet. Add your first study task above!";
    taskList.appendChild(empty);
  }

  filteredTasks.forEach(task => {
    const card = document.createElement("article");
    card.className = "task" + (task.completed ? " completed" : "");
    const title = document.createElement("h3");
    title.textContent = task.name;
    const subjectText = document.createElement("p");
    subjectText.textContent = "Subject: " + task.subject;
    const deadlineText = document.createElement("p");
    deadlineText.textContent = "Deadline: " + task.deadline;
    const statusText = document.createElement("p");
    statusText.textContent = "Status: " + (task.completed ? "Completed" : "Pending");
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.textContent = task.completed ? "Mark Pending" : "Mark Completed";
    completeButton.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
      message.textContent = "Task status updated.";
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
      message.textContent = "Task deleted.";
    });

    actions.append(completeButton, deleteButton);
    card.append(title, subjectText, deadlineText, statusText, actions);
    taskList.appendChild(card);
  });
  updateStats();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = taskName.value.trim();
  const selectedSubject = subject.value;
  const selectedDeadline = deadline.value;
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  if (!name || !selectedSubject || !selectedDeadline) {
    message.textContent = "Please complete all fields.";
    return;
  }
  if (selectedDeadline < localToday) {
    message.textContent = "Please choose today or a future deadline.";
    return;
  }

  tasks.push({
    id: Date.now() + Math.random(),
    name,
    subject: selectedSubject,
    deadline: selectedDeadline,
    completed: false
  });
  saveTasks();
  taskForm.reset();
  renderTasks();
  message.textContent = "Study task added successfully!";
});

searchInput.addEventListener("input", renderTasks);
filterStatus.addEventListener("change", renderTasks);
renderTasks();
