
"use strict";

// ===== SELECT HTML ELEMENTS =====
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const statusMessage = document.getElementById("statusMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompleted");

const STORAGE_KEY = "codveda_taskflow_tasks";

// ===== LOAD SAVED TASKS =====
let tasks = [];

try {
  const savedTasks = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  if (Array.isArray(savedTasks)) {
    tasks = savedTasks;
  }
} catch (error) {
  console.error("Unable to load saved tasks:", error);
}

let currentFilter = "all";

// ===== SAVE TO LOCAL STORAGE =====
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Unable to save tasks:", error);
    showMessage("Unable to save tasks in this browser.");
  }
}

// ===== SHOW STATUS MESSAGE =====
function showMessage(message) {
  statusMessage.textContent = message;
}

// ===== UPDATE STATISTICS =====
function updateStats() {
  const completed = tasks.filter(task => task.completed).length;

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completed;
  pendingTasks.textContent = tasks.length - completed;
}

// ===== FILTER TASKS =====
function getFilteredTasks() {
  if (currentFilter === "completed") {
    return tasks.filter(task => task.completed);
  }

  if (currentFilter === "pending") {
    return tasks.filter(task => !task.completed);
  }

  return tasks;
}

// ===== DISPLAY TASKS =====
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  emptyState.style.display =
    filteredTasks.length === 0 ? "block" : "none";

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
      "aria-label",
      `Mark ${task.text} as completed`
    );

    checkbox.addEventListener("change", () => {
      toggleTask(task.id);
    });

    // Task text
    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    // Action buttons container
    const buttons = document.createElement("div");
    buttons.className = "task-buttons";

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.setAttribute("aria-label", `Edit ${task.text}`);

    editBtn.addEventListener("click", () => {
      editTask(task.id);
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", `Delete ${task.text}`);

    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    buttons.append(editBtn, deleteBtn);
    li.append(checkbox, taskText, buttons);
    taskList.appendChild(li);
  });

  updateStats();
}

// ===== ADD TASK =====
taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (text.length === 0) {
    showMessage("Please enter a task.");
    return;
  }

  const newTask = {
    id: crypto.randomUUID(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();

  showMessage("Task added successfully!");
});

// ===== COMPLETE / UNCOMPLETE TASK =====
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();
  renderTasks();
  showMessage("Task status updated!");
}

// ===== EDIT TASK =====
function editTask(id) {
  const task = tasks.find(task => task.id === id);

  if (!task) return;

  const updatedText = prompt("Edit your task:", task.text);

  if (updatedText === null) return;

  const text = updatedText.trim();

  if (text.length === 0 || text.length > 100) {
    showMessage("Task must contain 1 to 100 characters.");
    return;
  }

  task.text = text;

  saveTasks();
  renderTasks();
  showMessage("Task updated successfully!");
}

// ===== DELETE TASK =====
function deleteTask(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmed) return;

  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  renderTasks();
  showMessage("Task deleted successfully!");
}

// ===== FILTER BUTTON EVENTS =====
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    renderTasks();
  });
});

// ===== CLEAR COMPLETED TASKS =====
clearCompletedBtn.addEventListener("click", () => {
  const completedCount = tasks.filter(
    task => task.completed
  ).length;

  if (completedCount === 0) {
    showMessage("No completed tasks to clear.");
    return;
  }

  const confirmed = confirm(
    "Delete all completed tasks?"
  );

  if (!confirmed) return;

  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  renderTasks();
  showMessage("Completed tasks cleared!");
});

// ===== INITIAL DISPLAY =====
renderTasks();
