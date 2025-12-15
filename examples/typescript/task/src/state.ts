export interface Task {
    id: number;
    name: string;
    completed: boolean;
}

export interface State {
    taskId: number;
    tasks: Task[];
    inputValue: string;
}

export const state: State = {
    taskId: 3,
    tasks: [
        { id: 1, name: "abc", completed: false },
        { id: 2, name: "123", completed: false },
        { id: 3, name: "xyz", completed: false },
    ],
    inputValue: ''
};
