type PropValue = string | number | boolean | (() => string | number | boolean);
type EventHandler = (event: Event) => void;

export type Props = {
  [K in string]: K extends `on${string}` ? EventHandler : PropValue;
};

type Child = string | Node | Promise<string | Node> | (() => Child);
type TagFn<E extends Element = Element> = (props?: Props, ...children: Child[]) => E;
type TagMap = Record<string, TagFn>;
type HtmlTagMap = { [K in keyof HTMLElementTagNameMap]: TagFn<HTMLElementTagNameMap[K]> } & TagMap;
type SvgTagMap = { [K in keyof SVGElementTagNameMap]: TagFn<SVGElementTagNameMap[K]> } & TagMap;

const append = (el: Element, children: Child[]) => {
  children.forEach((child) => {
    try {
      const result = typeof child === 'function' ? child() : child;
      if (result instanceof Promise) {
        const placeholder = document.createTextNode('');
        el.append(placeholder);
        result
          .then((c) => placeholder.replaceWith(typeof c === 'string' ? document.createTextNode(c) : c))
          .catch(console.error);
      } else if (typeof result === 'function') {
        // Recursive handling for nested functions if needed, or just append result of result
        // For simplicity/safety, treating result as Child and recursing one level via append logic would be ideal but complex.
        // Let's assume result of function is Node | string | Promise.
        // If result is function, it means HOC returning component? 
        // Let's recurse safely:
        append(el, [result]);
      } else {
        el.append(result as string | Node);
      }
    } catch (e) {
      console.error(e);
      // Optional: append error placeholder
    }
  });
};

const createElement = (ns: string | undefined) => (tag: string, props: Props = {}, ...children: Child[]): Element => {
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
  append(element, children);
  return element;
};

export const mount = (target: string | Element, ...children: Child[]): void => {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  el.replaceChildren();
  append(el, children);
};

const makeTags = <T extends TagMap>(ce: (tag: string, props?: Props, ...children: Child[]) => Element): T =>
  new Proxy({} as T, {
    get: (_, tag: string) => (props: Props = {}, ...children: Child[]) => ce(tag, props, ...children)
  }) as T;

export const tags: HtmlTagMap = makeTags<HtmlTagMap>(createElement(''));
export const tagsSvg: SvgTagMap = makeTags<SvgTagMap>(createElement('http://www.w3.org/2000/svg'));
