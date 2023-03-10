
let tasks = [""];

function updateTime() {
    chrome.storage.local.get(["timer", "timeOption"], (res) => {
        const time = document.getElementById("time-panel");
        const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0");
        let seconds = 60 - res.timer % 60 == 60 ? "00": `${60 - res.timer % 60}`.padStart(2, "0");
        time.textContent = minutes + ":" + seconds;
    })
}

updateTime();
setInterval(updateTime, 1000);

const startTimeBtn = document.getElementById("start-timer-btn");
startTimeBtn.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startTimeBtn.innerHTML = res.isRunning ? '<img src="../assets/play-start-icon.svg" alt="Start Timer">' : '<img src="../assets/play-stop-icon.svg" alt="Start Timer">';
        })
    })
})

const resetTimerBtn = document.getElementById("reset-timer-btn");
resetTimerBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
    }, () => {
        startTimeBtn.innerHTML = '<img src="../assets/play-start-icon.svg" alt="Start Timer">';
    })
})

const firstTask = document.getElementById("init-task-input");
firstTask.addEventListener("change", () => {
    tasks[0] = firstTask.value;
})

const addTaskBtn = document.getElementById("add-task-btn");
addTaskBtn.addEventListener("click", () => addTask());

chrome.storage.sync.get(["tasks"], (res) => {
    tasks = res.tasks ? res.tasks : [""]
    renderTasks();
})

function saveTasks() {
    chrome.storage.sync.set({
        tasks,
    })
}

function renderTask(taskNum) {
    const taskRow = document.createElement("div");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.addEventListener("change", e => {
        strikethroughTasks(e.target.checked, taskNum);
    })

    const text = document.createElement("input");
    text.type = "text";
    text.id = "task-input-" + taskNum;
    text.className = "task-input";
    text.placeholder = "Enter a task...";
    text.value = tasks[taskNum];
    text.addEventListener("change", () => {
        tasks[taskNum] = text.value;
        saveTasks();
    })

    const deleteBtn = document.createElement("input");
    deleteBtn.type = "button";
    deleteBtn.className = "task-delete";
    deleteBtn.value = "X";
    deleteBtn.addEventListener("click", () => {
        deleteTask(taskNum);
    })

    taskRow.appendChild(checkbox);
    taskRow.appendChild(text);
    taskRow.appendChild(deleteBtn);

    const taskContainer = document.getElementById("task-container");
    taskContainer.appendChild(taskRow);
}

function addTask() {
    const taskNum = tasks.length;
    tasks.push("");
    renderTask(taskNum);
    saveTasks();
}

function deleteTask(taskNum) {
    tasks.splice(taskNum, 1);
    renderTasks();
    saveTasks();
}

function strikethroughTasks(isChecked, taskNum) {
    const targetId = "task-input-" + taskNum;
    const input = document.getElementById(targetId);
    // text-decoration: line-through
    if (isChecked) {
        input.style.textDecoration = "line-through 5px";
        input.style.textDecorationColor = "rgba(83, 141, 114, .3)";
        input.style.backgroundColor = "rgba(249, 205, 173, .2)";
    } else {
        input.style.textDecoration = "none";
        input.style.backgroundColor = "whitesmoke";
    }
    
}

function renderTasks() {
    const taskContainer = document.getElementById("task-container");
    taskContainer.textContent = "";
    tasks.forEach((taskText, taskNum) => {
        renderTask(taskNum);
    })
}