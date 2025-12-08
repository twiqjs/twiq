// @vitest-environment happy-dom

import { describe, expect, it, vi } from 'vitest';
import { mount, tags, tagsSvg } from '@twiqjs/twiq';

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

  it('mounts content to an element by ID', () => {
    document.body.innerHTML = '<div id="app"></div>';
    mount('app', div({}, 'hello'));
    const app = document.getElementById('app');
    expect(app?.innerHTML).toBe('<div>hello</div>');
  });

  it('mounts content to a direct Element reference', () => {
    const container = document.createElement('div');
    mount(container, span({}, 'world'));
    expect(container.innerHTML).toBe('<span>world</span>');
  });

  it('mounts multiple children via spread syntax', () => {
    const container = document.createElement('div');
    const items = [
      span({ id: '1' }, 'one'),
      span({ id: '2' }, 'two')
    ];
    // Must use spread syntax as per strict specification
    mount(container, ...items);

    expect(container.childElementCount).toBe(2);
    expect(container.firstElementChild?.textContent).toBe('one');
    expect(container.lastElementChild?.textContent).toBe('two');
  });

  it('replaces content on subsequent mounts (replaceChildren behavior)', () => {
    const container = document.createElement('div');

    // First mount
    mount(container, div({ id: 'a' }, 'A'));
    expect(container.firstElementChild?.id).toBe('a');

    // Second mount (replace)
    mount(container, div({ id: 'b' }, 'B'));
    expect(container.innerHTML).toBe('<div id="b">B</div>');
    expect(container.firstElementChild?.id).toBe('b');
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
