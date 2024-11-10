import fs from 'fs/promises';

export class TaskList {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  async addTask(title, description = '') {
    const task = new Task(this.nextId++, title, description);
    this.tasks.push(task);
    await this.saveToFile();
    return task;
  }

  async removeTask(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      await this.saveToFile();
      return true;
    }
    return false;
  }

  async toggleTaskComplete(id) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.toggleComplete();
      await this.saveToFile();
      return true;
    }
    return false;
  }

  getAllTasks() {
    return this.tasks;
  }

  getCompletedTasks() {
    return this.tasks.filter(task => task.completed);
  }

  getPendingTasks() {
    return this.tasks.filter(task => !task.completed);
  }

  async saveToFile(filename = 'tasks.json') {
    try {
      await fs.writeFile(filename, JSON.stringify(this.tasks, null, 2));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  async loadFromFile(filename = 'tasks.json') {
    try {
      const data = await fs.readFile(filename, 'utf8');
      const tasks = JSON.parse(data);
      this.tasks = tasks.map(task => {
        const newTask = new Task(task.id, task.title, task.description);
        newTask.completed = task.completed;
        newTask.createdAt = new Date(task.createdAt);
        return newTask;
      });
      this.nextId = Math.max(...this.tasks.map(task => task.id), 0) + 1;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error loading tasks:', error);
      }
    }
  }
}