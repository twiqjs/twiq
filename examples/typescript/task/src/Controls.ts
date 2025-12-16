import { tags, dispatch } from 'twiq';
import { state } from './state';

const { div, input, button } = tags;

export const Controls = () => {
  return div({ class: 'flex' },
    input({
      id: 'task-input',
      class: 'grow border-high text-high p-1',
      type: 'text',
      placeholder: 'Task...',
      value: state.inputValue,
      onInput: (e: Event) => {
        const target = e.target as HTMLInputElement;
        state.inputValue = target.value;
      }
    }),
    button({
      class: 'bg-high text-high border-high p-1 pointer',
      onClick: () => {
        const name = state.inputValue.trim();
        if (!name) return;
        state.tasks.push({ id: ++state.taskId, name, completed: false });
        state.inputValue = '';
        dispatch('change:tasks');
        dispatch('change:controls');
      }
    }, 'Add')
  );
};
