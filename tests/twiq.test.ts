// @vitest-environment happy-dom

import { describe, expect, it, vi } from 'vitest';
import { render, tags, tagsSvg } from '@twiqjs/twiq';

const { button, div, input, li, span } = tags;

describe('twiq', () => {
  it('applies props, functional values, and events to elements', () => {
    const handleClick = vi.fn();
    const el = button(
      { class: 'primary', disabled: true, value: () => 'hello', onClick: handleClick },
      'Click'
    );

    expect(el.className).toBe('primary');
    expect(el.disabled).toBe(true);
    expect(el.getAttribute('value')).toBe('hello');

    el.dispatchEvent(new Event('click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('uses DOM properties when available instead of attributes', () => {
    const el = div({ textContent: 'hi' });
    expect(el.textContent).toBe('hi');
    expect(el.hasAttribute('textContent')).toBe(false);
  });

  it('creates custom elements as-is', () => {
    const widget = tags['my-widget']!({ 'data-id': 1 });
    expect(widget.tagName.toLowerCase()).toBe('my-widget');
    expect(widget.getAttribute('data-id')).toBe('1');
  });

  it('normalizes primitive children (string/number/boolean) to text nodes', () => {
    const el = div({}, 'foo', 42, false);
    expect(el.textContent).toBe('foo42false');
  });

  it('updates the element content on subsequent renders', () => {
    const view = render((count: number) => div({}, `count:${count}`));
    const container = document.createElement('div');

    const first = view(1);
    container.append(first);
    expect(first.textContent).toBe('count:1');

    const second = view(2);
    // Note: With Single Root (replaceWith), the root element instance changes.
    expect(second).not.toBe(first);
    expect(second.textContent).toBe('count:2');
    expect(container.firstElementChild).toBe(second);
  });



  it('replaces children when renderer output shape changes with new args', () => {
    const view = render((flag: boolean) =>
      div({},
        ...(flag
          ? [span({ id: 'on' }, 'on'), span({ id: 'extra' }, 'extra')]
          : [span({ id: 'off' }, 'off')]
        )
      )
    );
    const container = document.createElement('div');

    const el = view(true);
    container.append(el);
    expect(el.childElementCount).toBe(2);
    expect(el.firstElementChild?.id).toBe('on');

    const updated = view(false);
    expect(updated.childElementCount).toBe(1);
    expect(updated.firstElementChild?.id).toBe('off');
  });



  it('creates SVG elements in the correct namespace', () => {
    const { rect } = tagsSvg;
    const svgRect = rect({ width: 10, height: 5 });

    expect(svgRect.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(svgRect.getAttribute('width')).toBe('10');
    expect(svgRect.getAttribute('height')).toBe('5');
  });

  it('attaches different event handlers for different props', () => {
    const click = vi.fn();
    const mouseover = vi.fn();
    const el = div({ onClick: click, onMouseEnter: mouseover }, 'x');

    el.dispatchEvent(new Event('click'));
    el.dispatchEvent(new Event('mouseenter'));

    expect(click).toHaveBeenCalledTimes(1);
    expect(mouseover).toHaveBeenCalledTimes(1);
  });
});
