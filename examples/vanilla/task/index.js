import { tags, mount } from '../../../dist/twiq.js';

const { div, h1, ul, li, span, button, input } = tags;

let taskId = 0;
let tasks = [
  { id: ++taskId, name: "abc", completed: false },
  { id: ++taskId, name: "123", completed: false },
  { id: ++taskId, name: "xyz", completed: false },
];
let inputValue = '';

// Component: Controls (Function)
const Controls = () => {
  return div({ class: 'controls' },
    input({
      id: 'task-input',
      type: 'text',
      placeholder: 'Task...',
      value: inputValue,
      onInput: (e) => {
        inputValue = e.target.value;
      }
    }),
    button({
      class: 'add-btn',
      onClick: () => {
        const name = inputValue.trim();
        if (!name) return;
        tasks = [...tasks, { id: ++taskId, name, completed: false }];
        inputValue = '';
        // Granular update: Re-render list and controls (to clear input)
        mount('list-wrapper', TaskList);
        mount('controls-container', Controls);
      }
    }, 'Add')
  );
};

// Component: TaskItem (Function receiving props via closure/args? No, Functional Component takes no args in this simple impl, but can be HOC)
// Or just plain function returning Node.
const TaskItem = (task) => () =>
  li({ class: task.completed ? 'completed' : '' },
    span({ class: 'task-name' }, task.name),
    div({ class: 'task-buttons' },
      button({
        class: `complete-btn ${task.completed ? 'hidden' : ''}`,
        onClick: () => {
          tasks = tasks.map(t => t.id === task.id ? { ...t, completed: true } : t);
          // Granular update: Only list needs update
          mount('list-wrapper', TaskList);
        }
      }, 'Complete'),
      button({
        class: 'delete-btn',
        onClick: () => {
          tasks = tasks.filter(t => t.id !== task.id);
          // Granular update: Only list needs update
          mount('list-wrapper', TaskList);
        }
      }, 'Delete')
    )
  );

const TaskList = () => {
  // Simulate error if needed:
  // if (Math.random() > 0.9) throw new Error("Random Render Error");

  // throw new Error("意図的なレンダリングエラー");

  return ul({ id: 'task-list' },
    ...tasks.map(t => TaskItem(t))
  );
};

const Header = () => h1({}, 'TASK (Functional)');
const Footer = () => div({}, 'Footer');

const App = () => div({},
  Header,
  div({ id: 'controls-container' }, Controls),
  div({ id: 'list-wrapper' }, TaskList),
  Footer,
);

// Initial Static Render (includes initial dynamic content)
mount('app', App);
