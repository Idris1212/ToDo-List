const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const deleteAllBtn = document.getElementById("deleteAll");
const clearCompletedBtn = document.getElementById("clearCompleted");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const emptyState = document.getElementById("emptyState");


loadTasks();
updateUI();


addTaskBtn.addEventListener("click", () => addTask());


taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
  if (e.key === "Escape") taskInput.value = "";
});


deleteAllBtn.addEventListener("click", () => {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
  updateUI();
});

clearCompletedBtn.addEventListener("click", () => {
  document.querySelectorAll("#taskList li.completed").forEach(li => li.remove());
  saveTasks();
  updateUI();
});


function addTask(text = null, completed = false) {
  const taskText =
    typeof text === "string" ? text : taskInput.value.trim();

  if (!taskText) return;

  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = taskText;


  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
    updateUI();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.className = "delete";

  deleteBtn.addEventListener("click", e => {
    e.stopPropagation();
    li.remove();
    saveTasks();
    updateUI();
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  taskInput.value = "";
  saveTasks();
  updateUI();
}


function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach(task => addTask(task.text, task.completed));
}

function updateUI() {
  const total = document.querySelectorAll("#taskList li").length;
  const completed = document.querySelectorAll("#taskList li.completed").length;
  const remaining = total - completed;

  counter.textContent = `${total} total • ${completed} completed • ${remaining} remaining`;
  emptyState.style.display = total === 0 ? "block" : "none";
}
