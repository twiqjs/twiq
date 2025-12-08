# twiq

English | [Japanese](README_ja.md)

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
  import { tags, mount } from 'https://unpkg.com/@twiqjs/twiq/dist/twiq.js';
</script>
```

## Usage

### Basic Example

```ts
import { tags, mount } from '@twiqjs/twiq';

const { div, h1, button } = tags;

// 1. Define a component
// Components are just functions that return elements.
const App = (count) => 
  div({ id: 'app' },
    h1({}, `Count: ${count}`),
    button({ 
      onClick: () => update(count + 1) 
    }, 'Increment')
  );

// 2. Define update function
const update = (newCount) => {
  mount('app', App(newCount));
};

// 3. Initial mount
// You need a container in your HTML: <div id="app"></div>
mount('app', App(0));
```

### How It Works

`mount` is a simple helper that updates the content of a target element.

1.  **Target Resolution**: It finds the target element by ID (or accepts an Element directly).
2.  **Content Replacement**: It uses `replaceChildren` to replace the target's content with the new elements.

> [!NOTE]
> `twiq` does not use a Virtual DOM. `mount` replaces the children of the target element directly.

### Functional Components

Components are just functions that return elements.

```ts
const { li, span } = tags;

const TodoItem = (task) => 
  li({ class: task.completed ? 'done' : '' },
    span({}, task.title)
  );

// Usage in a list
// Note: You must use spread syntax (...) for arrays.
const TaskList = (tasks) => 
  div({}, 
    ...tasks.map(TodoItem)
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
- **children**: Strings or Nodes. **Arrays are not accepted** directly; use spread syntax (`...`).

### `mount(target, ...children)`

Updates the content of a target element.

- **target**: `string` (ID) or `Element`.
- **children**: `string` or `Node`. Multiple arguments can be passed.
- **Behavior**: Uses `replaceChildren` to update the target. Arrays must be spread (`...`).

## License

MIT
