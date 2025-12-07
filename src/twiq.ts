type PropValue = string | number | boolean | (() => string | number | boolean);
type EventHandler = (event: Event) => void;

export type Props = {
  [K in string]: K extends `on${string}` ? EventHandler : PropValue;
};
export type RenderCallback = (...args: any[]) => Element | DocumentFragment | Array<Element | DocumentFragment | null> | null;

// TagFn is generic so standard tag names can map to the correct element type.
type TagFn<E extends Element = Element> = (props?: Props, ...children: any[]) => E;
type TagMap = Record<string, TagFn>;
type HtmlTagMap = { [K in keyof HTMLElementTagNameMap]: TagFn<HTMLElementTagNameMap[K]> } & TagMap;
type SvgTagMap = { [K in keyof SVGElementTagNameMap]: TagFn<SVGElementTagNameMap[K]> } & TagMap;

const createElement = (ns: string | undefined) => (tag: string, props: Props = {}, ...children: any[]): Element => {
  const element = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
      return;
    }
    const finalValue = typeof value === 'function' ? value() : value;
    if (!ns && key in element) {
      (element as Record<string, any>)[key] = finalValue;
    } else {
      element.setAttribute(key, String(finalValue));
    }
  });
  element.append(...children);
  return element;
};

export const render = (createElements: RenderCallback): ((...args: any[]) => Element) => {
  let current: Element | null = null;

  return (...args: any[]) => {
    const result = createElements(...args);

    if (result instanceof DocumentFragment || Array.isArray(result) || result === null) {
      throw new Error('Render function must return a single Element.');
    }

    const newElement = result as Element;

    if (!current) {
      current = newElement;
    } else {
      current.replaceWith(newElement);
      current = newElement;
    }

    return current;
  };
};

const makeTags = <T extends TagMap>(ce: (tag: string, props?: Props, ...children: any[]) => Element): T =>
  new Proxy({} as T, {
    get: (_, tag: string) => (props: Props = {}, ...children: any[]) => ce(tag, props, ...children)
  }) as T;

export const tags: HtmlTagMap = makeTags<HtmlTagMap>(createElement(''));
export const tagsSvg: SvgTagMap = makeTags<SvgTagMap>(createElement('http://www.w3.org/2000/svg'));
