import { tags, mount, listen } from 'twiq';

// Dynamic Components for Syntax/Runtime Error Isolation
const AsyncControls = () => import('./Controls').then(m => m.Controls());
const AsyncTaskList = () => import('./TaskList').then(m => m.TaskList());

const { div, h1 } = tags;
const Header = () => h1({}, 'TASK (Helper Events)');
const Footer = () => div({}, 'Footer');

const App = () => div({},
    Header,
    div({ id: 'controls-container' }, AsyncControls),
    div({ id: 'list-wrapper' }, AsyncTaskList),
    Footer,
);

mount('app', App);

// Centralized Update Logic with listen helper
listen('change:tasks', () => {
    mount('list-wrapper', AsyncTaskList);
});

listen('change:controls', () => {
    mount('controls-container', AsyncControls);
});
