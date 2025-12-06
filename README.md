# twiq

English | [日本語](README_ja.md)

**twiq** is a tiny, zero-build, type-safe UI library for modern web development. It allows you to build declarative interfaces using standard HTML/SVG tags without the overhead of a Virtual DOM or complex build steps.

## Features

- 🪶 **Tiny**: Minimal footprint, zero dependencies.
- ⚡ **Zero Build**: Works directly in the browser (standard ES modules).
- 🛡️ **Type-Safe**: Full TypeScript support for HTML and SVG tags.
- � **Declarative**: Describe your UI as a pure function of state.
- 🧩 **No VDOM**: Direct DOM manipulation for maximum performance.

## Installation

```bash
npm install @twiqjs/twiq
```

Or use it directly via CDN in your HTML (ES Modules):

```html
<script type="module">
  import { tags, render } from 'https://unpkg.com/@twiqjs/twiq/dist/twiq.js';
</script>
```

## Usage

### Basic Example

```ts
import { tags, render } from '@twiqjs/twiq';

const { div, h1, button } = tags;

// 1. Define a renderer
// The function receives your data and returns the element structure.
const renderApp = render((count) => 
  div({ id: 'app' },
    h1({}, `Count: ${count}`),
    button({ 
      onClick: () => update(count + 1) 
    }, 'Increment')
  )
);

// 2. Define update function
const update = (newCount) => {
  renderApp(newCount);
};

// 3. Initial render & mount
document.body.append(renderApp(0));
```

### How It Works

twiq uses a "stable container" approach. When you call a function created by `render(...)`:

1.  **First Call**: It creates the DOM elements and returns the root element (or a fragment). You append this to the document.
2.  **Subsequent Calls**: It updates the *content* of that existing root element. It uses `replaceChildren` to efficiently update the view.

> [!NOTE]
> The element returned by the initial `render` call is stable. You should append it to the DOM once. Future updates will mutate the children of this element, not the element itself.

### Functional Components

Components are just functions that return elements.

```ts
const { li, span } = tags;

const TodoItem = (task) => 
  li({ class: task.completed ? 'done' : '' },
    span({}, task.title)
  );

// Usage in a list
const renderList = render((tasks) => 
  div({}, 
    ...tasks.map(TodoItem)
  )
);
```

### Event Handling

Props starting with `on` are treated as event listeners.

```ts
button({ onClick: (e) => console.log('Clicked!') }, 'Click Me')
```

### Styling

Use standard `class` attributes or `style` strings.

```ts
div({ class: 'container', style: 'color: red; padding: 10px;' }, 'Content')
```

## API Reference

### `tags` / `tagsSvg`

Proxies that generate functions for standard HTML and SVG elements.

```ts
const { div, span } = tags;
const { svg, circle } = tagsSvg;

// syntax: tag(props?, ...children)
div({ id: 'foo' }, 'Hello');
```

- **props**: Object key-values for attributes. `on[Event]` keys attach listeners. Functions passed as values are invoked.
- **children**: Strings, numbers, Nodes, or arrays of these.

### `render(callback)`

Creates an update function for the root.

- **callback**: `(...args) => Element | DocumentFragment | Array<...>`
- **Returns**: A function that accepts `...args`. calling this returned function updates the DOM.

## License

MIT
