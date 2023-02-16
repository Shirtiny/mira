/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 15:00:12
 * @LastEditTime: 2021-08-10 11:28:31
 * @Description: 渲染
 */

import { DOM, FC, MiraElement, IProps, AskrNode } from "./types";
import util from "../utils/util";

let rootAskrNode: AskrNode | null = null;

/**
 * @description:
 * @param {Props} props
 * @return {void}
 */
const updatePropsForDomEl = (
  preProps: IProps,
  nextProps: IProps,
  el: DOM,
): void => {
  const preKeys = Object.keys(preProps);
  const nextKeys = Object.keys(nextProps);

  preKeys.forEach((key) => {
    if (key === "children") {
      return;
    }
    if (key.startsWith("on")) {
      el.removeEventListener(key.substring(2).toLowerCase(), preProps[key]);
    } else {
      (<any>el)[key] = null;
    }
  });

  nextKeys.forEach((key) => {
    if (key === "children") {
      return;
    }
    if (key.startsWith("on")) {
      el.addEventListener(key.substring(2).toLowerCase(), nextProps[key]);
    } else {
      (<any>el)[key] = nextProps[key];
    }
  });
};

const createAskrNode = (element: MiraElement): AskrNode | null => {
  if (!element) return null;

  // 判断是否为函数组件 或对象
  const miraElement: MiraElement | null = util.isFn(element.type)
    ? (element.type as FC<IProps>)(element.props)
    : element;

  if (!miraElement) return null;

  // 渲染节点
  const { type, props } = miraElement;
  const el =
    type === ""
      ? document.createTextNode("")
      : document.createElement(type as string);

  // dom节点属赋值
  updatePropsForDomEl({}, props, el as DOM);

  const children = props.children || [];

  // 递归生成子节点的dom和node
  const kids: Array<AskrNode> = [];
  children.forEach((child: MiraElement) => {
    const node = createAskrNode(child);
    if (!node) return;
    kids.push(node);
    el.appendChild(node.dom);
  });

  const askrNode: AskrNode = {
    miraElement,
    dom: el as DOM,
    kids,
  };

  return askrNode;
};

const reconcileChildren = (askrNode: AskrNode, miraElement: MiraElement) => {
  // instance 旧
  // element 新
  const dom = askrNode.dom;
  const kids = askrNode.kids;
  const nextChildElements = miraElement.props.children || [];
  const newKids: Array<AskrNode> = []; // 新的孩子数组

  const count = Math.max(kids.length, nextChildElements.length);

  for (let i = 0; i < count; i++) {
    const kid = kids[i];
    const childElement = nextChildElements[i];

    // 2. 递归 - 上一层函数 reconcile
    const newKid = reconcile(dom, kid, childElement);
    if (newKid) {
      newKids.push(newKid);
    }
  }
  return newKids;
};

const reconcile = (
  parent: DOM,
  askrNode: AskrNode | null,
  element: MiraElement,
): AskrNode | null => {
  if (!parent || !element) return null;

  // 判断是否为函数组件 或对象
  const miraElement: MiraElement | null = util.isFn(element.type)
    ? (element.type as FC<IProps>)(element.props)
    : element;

  // 预渲染元素为空时 删除dom
  if (!miraElement) {
    askrNode?.dom && parent.removeChild(askrNode.dom);
    return null;
  }

  const type = askrNode?.miraElement?.type;
  // 类型相同复用dom
  if (askrNode && type && type === miraElement.type) {
    updatePropsForDomEl(
      askrNode.miraElement.props,
      miraElement.props,
      askrNode.dom,
    );
    // 1. 替换-新的孩子数组
    askrNode.kids = reconcileChildren(askrNode, miraElement);
    // 更新node引用的element
    askrNode.miraElement = miraElement;
    return askrNode;
  }

  const node = createAskrNode(miraElement);
  if (!askrNode) {
    node && parent.appendChild(node.dom);
  } else {
    node && parent.replaceChild(node.dom, askrNode.dom);
  }
  return node;
};

/**
 * @description：将虚拟元素节点渲染为dom节点
 * @param {MiraElement} miraElement 虚拟元素
 * @param {Element} parent dom
 * @return {void}
 */
const render = (miraElement: MiraElement, parent: DOM | null): void => {
  if (!parent) return;
  const preNode = rootAskrNode;
  const nextNode = reconcile(parent, preNode, miraElement);
  rootAskrNode = nextNode;
};

export default render;
