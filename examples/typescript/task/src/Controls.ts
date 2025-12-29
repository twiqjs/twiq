import { tags, tagsSvg } from 'twiq';

const { div, input, button } = tags;
const { svg, line } = tagsSvg;

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
    button(
      {
        class: 'bg-high text-high border-high p-1 pointer flex center',
        onClick: handleAdd
      },
      svg({ xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', class: 'stroke-high' },
        line({ x2: '8', y2: '14', x1: '8', y1: '2', 'stroke-linecap': 'round' }),
        line({ x2: '2', y2: '8', x1: '14', y1: '8', 'stroke-linecap': 'round' })
      ),
      'Add',
    )
  );
};
