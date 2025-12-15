import { tags, dispatch } from 'twiq';
import { state, type Task } from './state';

const { div, ul, li, span, button } = tags;

const TaskItem = (task: Task) => () =>
    li({ class: task.completed ? 'completed' : '' },
        span({ class: 'task-name' }, task.name),
        div({ class: 'task-buttons' },
            button({
                class: `complete-btn ${task.completed ? 'hidden' : ''}`,
                onClick: () => {
                    const target = state.tasks.find(t => t.id === task.id);
                    if (target) target.completed = true;
                    dispatch('change:tasks');
                }
            }, 'Complete'),
            button({
                class: 'delete-btn',
                onClick: () => {
                    state.tasks = state.tasks.filter(t => t.id !== task.id);
                    dispatch('change:tasks');
                }
            }, 'Delete')
        )
    );

export const TaskList = () => {
    return ul({ id: 'task-list' },
        ...state.tasks.map(t => TaskItem(t))
    );
};
