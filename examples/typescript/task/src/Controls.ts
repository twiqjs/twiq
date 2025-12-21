import { tags } from 'twiq';

const { div, input, button } = tags;

export type Props = {
  onAdd: (name: string) => void;
};

export const Controls = ({ onAdd }: Props) => {
  const inputEl = input({
    class: 'grow border-high text-high p-1',
    type: 'text',
    placeholder: 'Task...',
    onKeydown: (e: Event) => {
      if ((e as KeyboardEvent).key === 'Enter') handleAdd();
    }
  });

  const handleAdd = () => {
    const name = inputEl.value.trim();
    if (!name) return;
    onAdd(name);
  };

  return div({ class: 'flex' },
    inputEl,
    button({
      class: 'bg-high text-high border-high p-1 pointer',
      onClick: handleAdd
    }, 'Add')
  );
};
