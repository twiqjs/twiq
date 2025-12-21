export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export class TaskStore {
  tasks: Task[] = [];
  isSynced: boolean = false;

  addTask(name: string) {
    this.tasks.push({
      id: crypto.randomUUID(),
      name,
      completed: false
    });
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  updateTask(id: string, task: Partial<Task>) {
    const target = this.tasks.find(t => t.id === id);
    if (target) {
      Object.assign(target, task);
    }
  }

  setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.isSynced = true;
  }
}
