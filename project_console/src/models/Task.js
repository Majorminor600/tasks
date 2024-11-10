export class Task {
  constructor(id, title, description = '') {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date();
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt
    };
  }
}