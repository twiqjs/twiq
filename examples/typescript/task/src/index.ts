import { tags, mount, listen, Safe } from 'twiq';
import { Controls } from './Controls';
import { TaskList } from './TaskList';

const { div, h1 } = tags;
const Header = () => h1({}, 'TASKS');
const Footer = () => div({}, 'Footer');

const App = () => div({ id: 'frame', class: "bg-main app-py col" },
  div({ class: 'app-px' }, Header()),
  div({ id: 'controls-container', class: 'app-px' }, Controls()),
  div({ id: 'list-wrapper', class: 'app-px grow' }, Safe(TaskList, div({ class: 'err' }, 'Error'))),
  div({ class: 'app-px' }, Footer()),
);

mount('app', App());

listen('change:tasks', () => {
  mount('list-wrapper', Safe(TaskList, div({ class: 'err' }, 'Error')));
});

listen('change:controls', () => {
  mount('controls-container', Controls());
});
