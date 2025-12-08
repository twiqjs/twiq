type PropValue = string | number | boolean | (() => string | number | boolean);
type EventHandler = (event: Event) => void;

export type Props = {
  [K in string]: K extends `on${string}` ? EventHandler : PropValue;
};

type TagFn<E extends Element = Element> = (props?: Props, ...children: (string | Node)[]) => E;
type TagMap = Record<string, TagFn>;
type HtmlTagMap = { [K in keyof HTMLElementTagNameMap]: TagFn<HTMLElementTagNameMap[K]> } & TagMap;
type SvgTagMap = { [K in keyof SVGElementTagNameMap]: TagFn<SVGElementTagNameMap[K]> } & TagMap;

const createElement = (ns: string | undefined) => (tag: string, props: Props = {}, ...children: (string | Node)[]): Element => {
  const element = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
      return;
    }
    const finalValue = typeof value === 'function' ? value() : value;
    if (!ns && key in element) {
      (element as unknown as Record<string, string | number | boolean>)[key] = finalValue;
    } else {
      element.setAttribute(key, String(finalValue));
    }
  });
  element.append(...children);
  return element;
};

export const mount = (target: string | Element, ...children: (string | Node)[]): void => {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  el.replaceChildren(...children);
};

const makeTags = <T extends TagMap>(ce: (tag: string, props?: Props, ...children: (string | Node)[]) => Element): T =>
  new Proxy({} as T, {
    get: (_, tag: string) => (props: Props = {}, ...children: (string | Node)[]) => ce(tag, props, ...children)
  }) as T;

export const tags: HtmlTagMap = makeTags<HtmlTagMap>(createElement(''));
export const tagsSvg: SvgTagMap = makeTags<SvgTagMap>(createElement('http://www.w3.org/2000/svg'));
