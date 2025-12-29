import { tags } from 'twiq';
import { type Task } from './state';

const { div, ul, li, span, button } = tags;

type TaskItemProps = {
  onDelete: (id: string) => void;
  onUpdate: (id: string, task: Partial<Task>) => void;
};

const TaskItem = (task: Task, { onDelete, onUpdate }: TaskItemProps) =>
  li({ class: `p-2 flex col border-low ${task.completed ? 'bg-low' : ''}` },
    span({ class: 'grow text-low' }, task.name),
    div({ class: 'flex end' },
      button({
        class: 'border-high p-1 pointer bg-transparent',
        onClick: () => onDelete(task.id)
      }, 'Delete'),
      button({
        class: `bg-high text-high border-high border-high p-1 pointer`,
        disabled: task.completed ? true : false,
        onClick: () => onUpdate(task.id, { completed: true })
      }, task.completed ? 'Completed' : 'Complete'),
    )
  );

export type TaskListProps = {
  tasks: Task[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, task: Partial<Task>) => void;
  emptyMessage?: string;
};

export const TaskList = (props: TaskListProps) => {
  try {
    if (props.tasks.length === 0) {
      return ul({ id: 'task-list', class: 'grid temp-col list-style-none' },
        li({ class: 'p-2 text-low' }, props.emptyMessage || 'No tasks available.')
      );
    }
    return ul({ id: 'task-list', class: 'grid temp-col list-style-none' },
      ...props.tasks.map(t => TaskItem(t, props))
    );
  } catch (e) {
    console.error(e);
    return div({ class: 'err' }, 'Error');
  }
};
