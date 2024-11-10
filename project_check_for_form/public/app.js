let currentFilter = 'all';

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
    }
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const filteredTasks = filterTasks(tasks);

    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

function filterTasks(tasks) {
    switch (currentFilter) {
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'pending':
            return tasks.filter(task => !task.completed);
        default:
            return tasks;
    }
}

function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    taskDiv.innerHTML = `
        <div class="task-content">
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description || 'Нет описания'}</div>
            <div class="task-date">Создано: ${new Date(task.createdAt).toLocaleString('ru-RU')}</div>
        </div>
        <div class="task-actions">
            <button onclick="toggleTask(${task.id})">
                ${task.completed ? 'Отменить' : 'Выполнить'}
            </button>
            <button onclick="deleteTask(${task.id})">Удалить</button>
        </div>
    `;
    
    return taskDiv;
}

async function addTask() {
    const titleInput = document.getElementById('taskTitle');
    const descriptionInput = document.getElementById('taskDescription');
    
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (!title) return;
    
    try {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });
        
        titleInput.value = '';
        descriptionInput.value = '';
        loadTasks();
    } catch (error) {
        console.error('Ошибка при добавлении задачи:', error);
    }
}

async function toggleTask(id) {
    try {
        await fetch(`/api/tasks/${id}/toggle`, {
            method: 'PUT'
        });
        loadTasks();
    } catch (error) {
        console.error('Ошибка при изменении статуса задачи:', error);
    }
}

async function deleteTask(id) {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;
    
    try {
        await fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        });
        loadTasks();
    } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
    }
}

function showTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filters button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`button[onclick="showTasks('${filter}')"]`).classList.add('active');
    loadTasks();
}

// Загрузка задач при запуске
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});