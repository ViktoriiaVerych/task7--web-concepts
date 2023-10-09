class TodoItem {
    constructor(task, date) {
        this.task = task;
        this.date = date ? new Date(date) : new Date();
    }
    getTaskDate() {
        return ` (${this.date.toLocaleDateString()} ${this.date.toLocaleTimeString()})`;
    }
}


class TodoItemPremium extends TodoItem {
    constructor(task, image, date) {
        super(task, date);
        this.image = image;
    }

    getTaskImage() {
        return this.image;
    }
}

function addTaskAlert() {
    const taskInput = document.getElementById('new-task');
    const imageInput = document.getElementById('new-image').files[0];
    const taskValue = taskInput.value;

    if (taskValue && taskValue.trim() !== '') {
        addTask(taskValue, imageInput);
        taskInput.value = '';
        document.getElementById('new-image').value = '';
    }
}

function addTask(text, imageFile, date) {
    const list = document.getElementById('task-list');
    const fragment = document.createDocumentFragment();
    const item = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const taskText = document.createElement('span');
    let todoItem;

    if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = function () {
            const base64Image = reader.result;
            todoItem = new TodoItemPremium(text, base64Image, date);
            taskText.textContent = todoItem.task;
            const img = document.createElement('img');
            img.src = todoItem.getTaskImage();
            img.style.width = '30px';
            img.style.height = '30px';
            item.appendChild(img);
            appendTask();
        };
        reader.readAsDataURL(imageFile);
    } else {
        todoItem = new TodoItem(text, date);
        taskText.textContent = todoItem.task;
        appendTask();
    }

    function appendTask() {
        taskText.addEventListener('dblclick', editTask);
        const taskDate = document.createElement('span');
        taskDate.textContent = todoItem.getTaskDate();
        const buttons = document.createElement('div');
        const remove = document.createElement('button');
        remove.textContent = 'Remove';
        buttons.appendChild(remove);
        item.appendChild(checkbox);
        item.appendChild(taskText);
        item.appendChild(taskDate);
        item.appendChild(buttons);
        item.todoItem = todoItem;
        fragment.appendChild(item);
        list.insertBefore(fragment, list.childNodes[0]);
        saveTasks();
    }
}

function completeTask(e) {
    const item = e.target.parentNode;
    if (item.style.textDecoration === 'line-through') {
        item.style.textDecoration = 'none';
        item.firstChild.checked = false;
    } else {
        item.style.textDecoration = 'line-through';
        item.firstChild.checked = true;
    }
    saveTasks();
}

function removeTask(a) {
    const item = a.target.parentNode.parentNode;
    const parent = item.parentNode;
    parent.removeChild(item);
    saveTasks();
}

function editTask(a) {
    const item = a.target;
    const originalText = item.textContent;
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = originalText;
    inputField.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            saveTask(item, this, originalText);
        } else if (event.key === 'Escape') {
            cancelEdit(item, this, originalText);
        }
    });
    item.textContent = '';
    item.appendChild(inputField);
    saveTasks();
}

function saveTask(item, inputField, originalText) {
    const newText = inputField.value;
    if (newText && newText.trim() !== '') {
        item.textContent = newText;
        const date = new Date();
        const dateString = ` (${date.toLocaleDateString()} ${date.toLocaleTimeString()})`;
        item.nextSibling.textContent = dateString;
        const list = document.getElementById('task-list');
        list.insertBefore(item.parentNode, list.childNodes[0]);
    } else {
        cancelEdit(item, inputField, originalText);
    }
}

function cancelEdit(item, inputField, originalText) {
    item.removeChild(inputField);
    item.textContent = originalText;
}

function removeCompletedTasks() {
    const listItems = Array.from(document.querySelectorAll('#task-list li'));
    const completedItems = listItems.filter(item => item.firstChild.checked);
    completedItems.forEach(item => item.parentNode.removeChild(item));
}

function removeAllTasks() {
    const listItems = Array.from(document.querySelectorAll('#task-list li'));
    const uncompletedItems = listItems.filter(item => !item.firstChild.checked);
    const uncompletedExists = uncompletedItems.length > 0;
    if (uncompletedExists && !confirm("Are you sure you want to delete all tasks?")) {
        return;
    } else {
        uncompletedItems.forEach(item => item.parentNode.removeChild(item));
    }
    saveTasks();
}

function sortTasksAsc() {
    const list = document.getElementById('task-list');
    Array.from(list.getElementsByTagName("li"))
        .sort((a, b) => b.todoItem.date - a.todoItem.date)
        .forEach(li => list.appendChild(li));
    document.getElementById('sort-asc').classList.add('active');
    document.getElementById('sort-desc').classList.remove('active');
    saveTasks();
    localStorage.setItem('sortOrder', 'asc');
}

function sortTasksDesc() {
    const list = document.getElementById('task-list');
    Array.from(list.getElementsByTagName("li"))
        .sort((a, b) => a.todoItem.date - b.todoItem.date)
        .forEach(li => list.appendChild(li));

    document.getElementById('sort-desc').classList.add('active');
    document.getElementById('sort-asc').classList.remove('active');
    saveTasks();
    localStorage.setItem('sortOrder', 'desc');
}

function saveTasks() {
    const list = document.getElementById('task-list');
    const tasks = Array.from(list.getElementsByTagName("li")).map(li => li.todoItem);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTask(task.task, task.image, task.date));
    const sortOrder = localStorage.getItem('sortOrder');
    if (sortOrder === 'asc') {
        sortTasksAsc();
    } else if (sortOrder === 'desc') {
        sortTasksDesc();
    }
}

function clearStorage() {
    localStorage.clear();
    location.reload();
}

function pickTodo() {
    const list = document.getElementById('task-list');
    const tasks = Array.from(list.getElementsByTagName("li"));
    if (tasks.length > 0) {
        tasks.forEach(task => task.classList.remove('active'));
        const randomIndex = Math.floor(Math.random() * tasks.length);
        const randomTask = tasks[randomIndex];
        randomTask.classList.add('active');
    }
}

function saveTasks() {
    const list = document.getElementById('task-list');
    const tasks = Array.from(list.getElementsByTagName("li")).map(li => li.todoItem);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTask(task.task, task.image, task.date));
    const sortOrder = localStorage.getItem('sortOrder');
    if (sortOrder === 'asc') {
        sortTasksAsc();
    } else if (sortOrder === 'desc') {
        sortTasksDesc();
    }
}

function clearStorage() {
    localStorage.clear();
    location.reload();
}

function pickTodo() {
    const list = document.getElementById('task-list');
    const tasks = Array.from(list.getElementsByTagName("li"));
    if (tasks.length > 0) {
        tasks.forEach(task => task.classList.remove('active'));
        const randomIndex = Math.floor(Math.random() * tasks.length);
        const randomTask = tasks[randomIndex];
        randomTask.classList.add('active');
    }
}
