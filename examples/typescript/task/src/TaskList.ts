import { tags, tagsSvg } from 'twiq';
import { type Task } from './state';

const { div, ul, li, span, button } = tags;
const { svg, line } = tagsSvg;

type TaskItemProps = {
  onDelete: (id: string) => void;
  onUpdate: (id: string, task: Partial<Task>) => void;
};

const TaskItem = (task: Task, { onDelete, onUpdate }: TaskItemProps) =>
  li({ class: `p-2 flex col border-low ${task.completed ? 'bg-low' : ''}` },
    span({ class: 'grow text-low' }, task.name),
    div({ class: 'flex end' },
      button(
        {
          class: `bg-high text-high border-high border-high p-1 pointer flex center`,
          disabled: task.completed ? true : false,
          onClick: () => onUpdate(task.id, { completed: true })
        },
        svg({ xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', class: 'stroke-high' },
          line({ x2: '8', y2: '14', x1: '2', y1: '8', 'stroke-linecap': 'round' }),
          line({ x2: '14', y2: '2', x1: '8', y1: '14', 'stroke-linecap': 'round' })
        ),
        task.completed ? 'Completed' : 'Complete'
      ),
      button(
        {
          class: 'border-high p-1 pointer bg-transparent flex center',
          onClick: () => onDelete(task.id)
        },
        svg({ xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', class: 'stroke-low' },
          line({ x2: '14', y2: '14', x1: '2', y1: '2', 'stroke-linecap': 'round' }),
          line({ x2: '14', y2: '2', x1: '2', y1: '14', 'stroke-linecap': 'round' })
        )
      ),
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
