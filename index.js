// Get DOM elements
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const themeToggle = document.getElementById('theme-toggle');

// Load theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach(task => addTask(task.text, task.completed));

// Handle form submission to add a new task
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = input.value.trim();
    if (taskText) {
        addTask(taskText, false);
        tasks.push({ text: taskText, completed: false });
        saveTasks();
        input.value = '';
    }
});

// Function to add a task to the list
function addTask(text, completed = false) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (completed) li.classList.add('completed');
    li.innerHTML = `
        <input type="checkbox" class="toggle-completed" ${completed ? 'checked' : ''}>
        <span class="task-text">${text}</span>
        <button class="edit-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
        </button>
        <button class="delete-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
    `;
    li.classList.add('fade-in');
    todoList.appendChild(li);

    // Add event listeners for checkbox, edit, and delete buttons
    li.querySelector('.toggle-completed').addEventListener('change', (e) => toggleCompleted(e.target, li, text));
    li.querySelector('.edit-btn').addEventListener('click', () => editTask(li, text));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(li, text));
}

// Function to toggle task completion
function toggleCompleted(checkbox, li, text) {
    li.classList.toggle('completed');
    const taskIndex = tasks.findIndex(task => task.text === text);
    tasks[taskIndex].completed = checkbox.checked;
    saveTasks();
}

// Function to edit a task
function editTask(li, oldText) {
    const taskSpan = li.querySelector('.task-text');
    const newText = prompt('Edit task:', taskSpan.textContent);
    if (newText && newText.trim()) {
        taskSpan.textContent = newText.trim();
        const taskIndex = tasks.findIndex(task => task.text === oldText);
        tasks[taskIndex].text = newText.trim();
        saveTasks();
    }
}

// Function to delete a task
function deleteTask(li, text) {
    li.classList.add('fade-out');
    li.addEventListener('animationend', () => {
        li.remove();
        tasks = tasks.filter(task => task.text !== text);
        saveTasks();
    }, { once: true });
}

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}