import { tags, mount, safe } from 'twiq';
import { Controls } from './Controls';
import { TaskList, type TaskListProps } from './TaskList';
import { TaskStore, type Task } from './state';

const { div, h1 } = tags;
const Header = () => h1({}, 'TASKS');
const Footer = () => div({}, 'Footer');

const store = new TaskStore();

const getTasks = () => {
  return new Promise<Task[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { id: crypto.randomUUID(), name: "abc", completed: false },
        { id: crypto.randomUUID(), name: "123", completed: false },
        { id: crypto.randomUUID(), name: "xyz", completed: false },
      ]);
    }, 2000);
  });
};

// Component creators to reuse props logic
const createTaskList = () => {
  const props: TaskListProps = {
    tasks: store.tasks,
    onDelete: (id: string) => {
      store.deleteTask(id);
      renderTaskList();
    },
    onUpdate: (id: string, task: Partial<Task>) => {
      store.updateTask(id, task);
      renderTaskList();
    }
  };
  return safe(() => TaskList(props), div({ class: 'err' }, 'Error'));
};

const createControls = () => {
  return Controls({
    onAdd: (name: string) => {
      store.addTask(name);
      renderTaskList();
      renderControls();
    }
  });
};

// Update functions
const renderTaskList = () => {
  mount('list-wrapper', createTaskList());
};

const renderControls = () => {
  mount('controls-container', createControls());
};

const App = () => div({ id: 'frame', class: "bg-main app-py col" },
  div({ class: 'app-px' }, Header()),
  // Nested declarative structure: Components are rendered immediately
  div({ id: 'controls-container', class: 'app-px' }, createControls()),
  div({ id: 'list-wrapper', class: 'app-px grow' }, createTaskList()),
  div({ class: 'app-px' }, Footer()),
);

mount('app', App());

// Initial load
getTasks().then((tasks) => {
  store.setTasks(tasks);
  renderTaskList();
  // Controls doesn't need update on data fetch, but consistent with previous logic
});
