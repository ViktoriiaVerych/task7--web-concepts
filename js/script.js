document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("tasks");
    const removeCompletedButton = document.getElementById("removeCompleted");
    const removeAllButton = document.getElementById("removeAll");
    let tasks = [];

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.sort((a, b) => b.date - a.date);
        
        for (const task of tasks) {
            const listItem = document.createElement("li");
            const taskText = document.createElement("span");
            const editInput = document.createElement("input");
            const saveButton = document.createElement("button");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            listItem.appendChild(checkbox);
            taskText.innerText = task.text;
            taskText.classList.add(task.completed ? "completed" : "editable");
            listItem.appendChild(taskText);
            editInput.value = task.text;
            editInput.classList.add("edit-input");
            listItem.appendChild(editInput);
            saveButton.innerText = "Save";
            saveButton.classList.add("save-button");
            listItem.appendChild(saveButton);

            taskText.addEventListener("dblclick", () => {
                taskText.style.display = "none";
                editInput.style.display = "inline-block";
                editInput.focus();
                saveButton.style.display = "inline-block";
            });




            saveButton.addEventListener("click", () => {
                task.text = editInput.value.trim();
                task.completed = checkbox.checked;
                task.date = Date.now();
                renderTasks();
            });

            editInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    task.text = editInput.value.trim();
                    task.completed = checkbox.checked;
                    task.date = Date.now();
                    renderTasks();
                } else if (e.key === "Escape") {
                    taskText.style.display = "inline-block";
                    editInput.style.display = "none";
                    saveButton.style.display = "none";
                }
            });



            const removeButton = document.createElement("button");
            removeButton.innerText = "Remove";
            listItem.appendChild(removeButton);
            removeButton.addEventListener("click", () => {
                tasks = tasks.filter(t => t !== task);
                renderTasks();
            });

            taskList.appendChild(listItem);
        }
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text === "") return;

        const task = {
            text,
            date: Date.now(),
            completed: false
        };

        tasks.push(task);
        taskInput.value = "";
        renderTasks();
    }

    addTaskButton.addEventListener("click", addTask);
    taskInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    });
    renderTasks();

    removeCompletedButton.addEventListener("click", () => {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    });

    removeAllButton.addEventListener("click", () => {
        const confirmDelete = confirm("Are you sure?");
        if (confirmDelete) {
            tasks = [];
            renderTasks();
        }
    });
});
