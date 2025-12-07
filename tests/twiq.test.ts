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

  it('reuses the same root between renders and replaces children', () => {
    const view = render((count: number) => div({}, `count:${count}`));

    const first = view(1);
    const second = view(2);

    expect(second).toBe(first);
    expect(first.textContent).toBe('count:2');
  });

  it('normalizes arrays and nullish children through render()', () => {
    const view = render((items: Array<string | null>) =>
      items.map((item, index) => (item ? li({ 'data-index': index }, item) : null))
    );

    const fragment = view(['a', null, 'b']);
    expect(fragment).toBeInstanceOf(DocumentFragment);
    expect(fragment.childElementCount).toBe(2);
    expect(fragment.firstElementChild?.textContent).toBe('a');

    const sameFragment = view(['c']);
    expect(sameFragment).toBe(fragment);
    expect(fragment.childElementCount).toBe(1);
    expect(fragment.firstElementChild?.textContent).toBe('c');
  });

  it('replaces children when renderer output shape changes with new args', () => {
    const view = render((flag: boolean) =>
      flag
        ? [span({ id: 'on' }, 'on'), span({ id: 'extra' }, 'extra')]
        : [span({ id: 'off' }, 'off')]
    );

    const fragment = view(true);
    expect(fragment.childElementCount).toBe(2);
    expect(fragment.firstElementChild?.id).toBe('on');

    const sameFragment = view(false);
    expect(sameFragment).toBe(fragment);
    expect(fragment.childElementCount).toBe(1);
    expect(fragment.firstElementChild?.id).toBe('off');
  });

  it('accepts DocumentFragments from the renderer', () => {
    const view = render((letters: string[]) => {
      const fragment = document.createDocumentFragment();
      letters.forEach((letter) => fragment.append(span({}, letter)));
      return fragment;
    });

    const first = view(['x', 'y']);
    expect(first).toBeInstanceOf(DocumentFragment);
    expect(first.childNodes).toHaveLength(2);

    const second = view(['z']);
    expect(second).toBe(first);
    expect(first.childNodes).toHaveLength(1);
    expect(first.firstChild?.textContent).toBe('z');
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
