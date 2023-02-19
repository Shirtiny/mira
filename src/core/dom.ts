import { grow, growForAskrNode } from "./jsx";
import lang from "../utils/lang";
import style from "./style";
import { RenderTarget, MiraElement, AskrNode } from "./types";

type CanBeEmpty<T> = T | null | undefined;

type ElementNode = RenderTarget | Document;

export function isElement(arg?: any): arg is Element {
  return arg?.nodeType === Node.ELEMENT_NODE;
}
export function isHtmlElement(arg?: any): arg is HTMLElement {
  return lang.isObject(arg) && arg instanceof HTMLElement;
}
export function isText(arg?: any): arg is Text {
  return arg?.nodeType === Node.TEXT_NODE;
}
export function isComment(arg?: any): arg is Comment {
  return arg?.nodeType === Node.COMMENT_NODE;
}
export function isDocument(arg?: any): arg is Document {
  return arg?.nodeType === Node.DOCUMENT_NODE;
}
export function isDocumentType(arg?: any): arg is DocumentType {
  return arg?.nodeType === Node.DOCUMENT_TYPE_NODE;
}
export function isDocumentFragment(arg?: any): arg is DocumentFragment {
  return arg?.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}

export function parseHtml(htmlString: string): DocumentFragment {
  return document.createRange().createContextualFragment(htmlString);
}

export function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  properties?: object,
  is?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag, { is });

  return Object.assign(element, properties);
}

export function createFragment() {
  return document.createDocumentFragment();
}

export function append<N extends ElementNode>(
  parent?: N | null,
  ...children: any[]
): void {
  if (!parent || !children.length) return;
  const frag = createFragment();
  frag.append(...children.filter((n) => n));
  parent.appendChild(frag);
}

export function empty<N extends ElementNode>(parent?: N | null): void {
  if (!parent) return;
  if (isElement(parent)) {
    parent.innerHTML = "";
    return;
  } else {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
}

export function replace<N extends ElementNode>(
  oldNode: CanBeEmpty<N>,
  ...newNodes: any[]
): void {
  if (!newNodes.length || !oldNode?.parentNode) return;
  const nodes = newNodes.filter((n) => n);
  if (isElement(oldNode)) {
    oldNode.replaceWith(...nodes);
  } else {
    const frag = createFragment();
    frag.append(...nodes);
    oldNode.parentNode.replaceChild(frag, oldNode);
  }
}

export function replaceChild<N extends ElementNode>(
  parentNode: CanBeEmpty<N>,
  oldNode: CanBeEmpty<N>,
  ...newNodes: any[]
): void {
  if (!newNodes.length || !oldNode || !parentNode) return;
  const nodes = newNodes.filter((n) => n);
  const frag = createFragment();
  frag.append(...nodes);
  parentNode.replaceChild(oldNode, frag);
}

export function removeSelf<N extends ElementNode>(el: CanBeEmpty<N>): void {
  if (!el) return;
  if (isElement(el)) {
    el.remove();
    return;
  } else {
    el.parentNode?.removeChild(el);
  }
}

export function clearContainer<N extends ElementNode>(
  container: CanBeEmpty<N>,
) {
  if (!container) return;
  if (isElement(container)) {
    // We have refined the container to Element type
    const element = container as Element;
    element.textContent = "";
  } else if (isDocument(container)) {
    // We have refined the container to Document type
    const doc = container as Document;
    if (doc.documentElement) {
      doc.removeChild(doc.documentElement);
    }
  }
}

// 不导出 外部没必要使用
function elementFactory(element: MiraElement | null) {
  if (!element || !element.props) return element;
  // const { props } = element;
  // if (props.withCommonNamespace) {
  //   props.className = style.commonCls(props.className);
  //   delete props.withCommonNamespace;
  // }
  return element;
}

// 从jsx创建dom节点
export function createByJsx<T = RenderTarget>(
  element: MiraElement | null,
): T | null {
  if (!element) return null;
  return <T>(<unknown>grow(element, elementFactory));
}

// 从askrNode创建dom节点
export function createByAskr<T = RenderTarget>(
  askr: AskrNode | null,
): T | null {
  if (!askr) return null;
  return <T>(<unknown>growForAskrNode(askr));
}

export function getElementTypeByTag<K extends keyof HTMLElementTagNameMap>(
  tag: K,
) {
  return Reflect.getPrototypeOf(document.createElement(tag))!
    .constructor as any;
}

export function toAttribute(propName: string) {
  return propName
    .replace(/\.?([A-Z]+)/g, (_x, y) => y.toLowerCase())
    .replace("_", "-")
    .replace(/^-/, "");
}

export function applyAttribute(
  el: Element,
  attributeName: string | undefined,
  value: any,
) {
  if (!el || !isElement(el)) return;
  if (!attributeName) return;
  if (lang.isObject(value)) return;

  let reflect = value
    ? typeof value.toString === "function"
      ? value.toString()
      : undefined
    : undefined;

  const attribute = toAttribute(attributeName);
  if (reflect && reflect !== "false") {
    if (reflect === "true") reflect = "";
    el.setAttribute(attribute, reflect);
  } else {
    el.removeAttribute(attribute);
  }
}

export function applyStyle(el: RenderTarget, styles: Object | string) {
  if (!el || !isHtmlElement(el)) return;
  if (lang.isString(styles)) {
    el.setAttribute("style", style.line(styles));
    return;
  }
  const cssStyle = style.toCSSStyle(styles, {
    onCustomProperty: (name, value) => {
      el.style.setProperty(name, value);
    },
  });
  for (const name in cssStyle) {
    if (Object.prototype.hasOwnProperty.call(cssStyle, name)) {
      const value = cssStyle[name];
      !lang.isUndefined(value) && (el.style[name] = value);
    }
  }
}

const dom = {
  parseHtml,
  create,
  createFragment,
  createByJsx,
  createByAskr,
  append,
  empty,
  replace,
  removeSelf,
  getElementTypeByTag,
  toAttribute,
  applyAttribute,
  applyStyle,
  replaceChild,
  clearContainer,
  isElement,
  isHtmlElement,
  isText,
  isComment,
  isDocument,
  isDocumentType,
  isDocumentFragment,
};

export default dom;
