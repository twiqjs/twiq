import { tags, dispatch } from 'twiq';
import { state, type Task } from './state';

const { div, ul, li, span, button } = tags;

const TaskItem = (task: Task) => () =>
  li({ class: `p-2 flex col border-low ${task.completed ? 'bg-low' : ''}` },
    span({ class: 'grow text-low' }, task.name),
    div({ class: 'flex end' },
      button({
        class: 'border-high p-1 pointer bg-transparent',
        onClick: () => {
          state.tasks = state.tasks.filter(t => t.id !== task.id);
          dispatch('change:tasks');
        }
      }, 'Delete'),
      button({
        class: `bg-high text-high border-high border-high p-1 pointer`,
        disabled: task.completed ? true : false,
        onClick: () => {
          const target = state.tasks.find(t => t.id === task.id);
          if (target) target.completed = true;
          dispatch('change:tasks');
        }
      }, task.completed ? 'Completed' : 'Complete'),
    )
  );

const getTasks = () => {
  return new Promise<Task[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "abc", completed: false },
        { id: 2, name: "123", completed: false },
        { id: 3, name: "xyz", completed: false },
      ]);
    }, 2000);
  });
};

export const TaskList = () => {
  if (state.isSynced) {
    return ul({ id: 'task-list', class: 'grid temp-col list-style-none' },
      ...state.tasks.map(t => TaskItem(t)())
    );
  }

  const container = ul({ id: 'task-list', class: 'grid temp-col list-style-none' },
    'Loading...'
  );

  getTasks().then((tasks) => {
    state.tasks = tasks;
    state.isSynced = true;
    dispatch('change:tasks');
  });

  return container;
};
