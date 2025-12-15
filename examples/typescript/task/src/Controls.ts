import { tags, dispatch } from 'twiq';
import { state } from './state';

const { div, input, button } = tags;

export const Controls = () => {
    return div({ class: 'controls' },
        input({
            id: 'task-input',
            type: 'text',
            placeholder: 'Task...',
            value: state.inputValue,
            onInput: (e: Event) => {
                const target = e.target as HTMLInputElement;
                state.inputValue = target.value;
            }
        }),
        button({
            class: 'add-btn',
            onClick: () => {
                const name = state.inputValue.trim();
                if (!name) return;
                state.tasks.push({ id: ++state.taskId, name, completed: false });
                state.inputValue = '';

                // Notify using helper
                dispatch('change:tasks');
                dispatch('change:controls');
            }
        }, 'Add')
    );
};
