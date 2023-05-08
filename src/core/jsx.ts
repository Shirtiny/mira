/*
 * @Author: Shirtiny
 * @Date: 2021-12-11 08:25:24
 * @LastEditTime: 2022-01-17 14:19:30
 * @Description: 项目写的jsx只是创建dom时执行一次 无其他逻辑
 */

import util from "~src/utils/util";
import lang from "../utils/lang";
import logger from "../utils/logger";
import dom from "./dom";
import { IProps, RenderTarget, MiraElement, AskrNode } from "./types";

const TEXT_ELEMENT_TYPE = "#text";

function checkIsNotEmptyChild(x: any) {
  return x != null && x !== true && x !== false;
}

function text(v?: any): MiraElement {
  return { type: TEXT_ELEMENT_TYPE, props: { nodeValue: String(v) + "" } } as MiraElement;
}

export function checkIsTextElement(type: any) {
  return type === TEXT_ELEMENT_TYPE;
}

function flatAndFilter(arr: any[], target: any[] = []) {
  arr.forEach((v) => {
    lang.isArray(v)
      ? flatAndFilter(v, target)
      : checkIsNotEmptyChild(v) && target.push(lang.isText(v) ? text(v) : v);
  });
  return target;
}

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

type TagElementOption = {
  ns?: string;
  is?: string;
};

function tagElement(tag: string, option: TagElementOption) {
  const { ns, is } = option;
  return checkIsTextElement(tag)
    ? document.createTextNode("")
    : ns
    ? (document.createElementNS(ns, tag, { is }) as Element & SVGElement)
    : document.createElement(tag, { is });
}

// 超简单易懂的实现 很多情况不考虑
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

export function growForAskrNode(askrNode: AskrNode | AskrNode[]) {
  if (!askrNode) return null;

  if (lang.isArray(askrNode)) {
    // const frag = document.createDocumentFragment();
    // askrNode.forEach((e) => {
    //   const node = growForAskrNode(e);
    //   node && frag.appendChild(node);
    // });
    // return frag;
    return askrNode;
  }

  const { pendingProps, type } = askrNode;

  // 注意 所有h创建element都会有props
  // 如果出现props为空的现象 请检查是不是混用了dom和jsx
  if (!pendingProps) {
    const isRenderTarget = askrNode instanceof Node || askrNode instanceof Text;
    if (!isRenderTarget) {
      logger.warn(
        "jsx",
        "grow",
        `未解析${askrNode},因为它不是有效的jsx element，并且也不是RenderTarget类型`,
      );
      return null;
    }
    logger.warn(
      "jsx",
      "grow",
      `提示${askrNode}并不是有效的jsx element 已经原样输出，不影响ui 但尽量少混用jsx和dom`,
    );
    return askrNode as unknown as RenderTarget;
  }

  if (lang.isString(type)) {
    const el = tagElement(type, {
      ns: pendingProps.xmlns,
      is: pendingProps.is,
    });
    initProps(pendingProps, el);
    // const children = pendingProps.children || [];

    // children.forEach((child: AskrNode) => {
    //   const node = growForAskrNode(child, pendingProps.xmlns);
    //   if (!node) return;
    //   el.appendChild(node);
    // });
    return el;
  }

  return null;
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  type: K | string,
  elementProps: IProps,
  ...childElements: any[]
): MiraElement {
  elementProps = elementProps || {};
  childElements = flatAndFilter(
    util.toArray(elementProps.children || childElements),
  );
  elementProps.children = childElements;
  return {
    type,
    props: elementProps,
  };
}

export const Fragment = (props: IProps) => props.children;

export const createDom = grow;

const jsx = {
  TEXT_ELEMENT_TYPE,
  createElement,
  Fragment,
  grow,
  createDom,
  checkIsTextElement,
};

export default jsx;
