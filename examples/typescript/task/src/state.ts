export interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export interface State {
  taskId: number;
  tasks: Task[];
  inputValue: string;
  isSynced: boolean;
}

export const state: State = {
  taskId: 3,
  tasks: [],
  inputValue: '',
  isSynced: false
};
