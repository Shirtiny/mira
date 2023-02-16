import dom from "./dom";
import lang from "../utils/lang";
import logger from "../utils/logger";
import { IProps, RenderTarget, MiraElement, AskrNode } from "./types";

let rootAskrNode: AskrNode | null = null;

// 只初始化无更新逻辑
function initProps(props: IProps = {}, el: RenderTarget): void {
  if (!el) return;
  const keys = Object.keys(props);

  keys.forEach((k) => {
    if (k === "children" || k === "is") {
      return;
    }
    const v = props[k];
    if (lang.isNullOrUndefined(v)) return;

    if (k.startsWith("on")) {
      el.addEventListener(k.substring(2).toLowerCase(), v);
    } else {
      let attribute = k,
        value = v;
      switch (k) {
        case "className": {
          attribute = "class";
          break;
        }
        case "style": {
          dom.applyStyle(el, v);
          return;
        }

        default: {
          break;
        }
      }
      if (el instanceof Element) {
        dom.applyAttribute(el, attribute, value);
      } else {
        (<any>el)[attribute] = value;
      }
    }
  });
}

function tagElement(
  tag: string,
  option: {
    ns?: string;
    is?: string;
  },
) {
  const { ns, is } = option;
  return tag === ""
    ? document.createTextNode("")
    : ns
    ? (document.createElementNS(ns, tag, { is }) as Element & SVGElement)
    : document.createElement(tag, { is });
}

export function grow(
  element: MiraElement | null,
  elementFactory?: (element: MiraElement | null) => MiraElement | null,
  xmlns?: string,
): RenderTarget {
  const product = elementFactory ? elementFactory(element) : element;

  if (!product) return null;

  //FIXME:Fragment的实现并不是这样的 不过这样目的也达到了
  if (lang.isArray(product)) {
    const frag = document.createDocumentFragment();
    product.forEach((e) => {
      const node = grow(e);
      node && frag.appendChild(node);
    });
    return frag;
  }

  const { props, type } = product;

  // 注意 所有h创建element都会有props
  // 如果出现props为空的现象 请检查是不是混用了dom和jsx
  if (!props) {
    const isRenderTarget = product instanceof Node || product instanceof Text;
    if (!isRenderTarget) {
      logger.warn(
        "jsx",
        "grow",
        `未解析${product},因为它不是有效的jsx element，并且也不是RenderTarget类型`,
      );
      return null;
    }
    logger.warn(
      "jsx",
      "grow",
      `提示${product}并不是有效的jsx element 已经原样输出，不影响ui 但尽量少混用jsx和dom`,
    );
    return product as unknown as RenderTarget;
  }

  if (lang.isString(type)) {
    const el = tagElement(type, {
      ns: props.xmlns || xmlns,
      is: props.is,
    });
    initProps(props, el);
    const children = props.children || [];

    children.forEach((child: MiraElement) => {
      const node = grow(child, elementFactory, props.xmlns);
      if (!node) return;
      el.appendChild(node);
    });
    return el;
  }

  if (lang.isFn(type)) {
    const miraElement: MiraElement | null = type(props);
    return grow(miraElement, elementFactory);
  }

  return null;
}

const reconcile = (
  parent: Node,
  askrNode: AskrNode | null,
  element: MiraElement,
): AskrNode | null => {
  if (!parent || !element) return null;

  const node = grow(element);
  if (!askrNode) {
    node && parent.appendChild(node);
  } else {
    node && dom.replaceChild(parent, askrNode.dom, node);
  }
  return {
    miraElement: element,
    dom: node,
    kids: [],
  };
};

/**
 * @description：将虚拟元素节点渲染为dom节点
 * @param {MiraElement} miraElement 虚拟元素
 * @param {Element} parent dom
 * @return {void}
 */
const render = (miraElement: MiraElement, parent: Node): void => {
  if (!parent) return;
  const preNode = rootAskrNode;
  const nextNode = reconcile(parent, preNode, miraElement);
  rootAskrNode = nextNode;
};

export default render;
