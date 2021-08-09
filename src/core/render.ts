import { AskrNode } from "./types";
/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 15:00:12
 * @LastEditTime: 2021-08-09 17:53:04
 * @Description: 渲染
 */

import { DOM, FC, MiraElement, Props } from "./types";
import util from "../utils/util";

let rootAskrNode: AskrNode | null = null;

/**
 * @description:
 * @param {Props} props
 * @return {void}
 */
const updatePropsForDomEl = (
  preProps: Props,
  nextProps: Props,
  el: DOM,
): void => {
  const preKeys = Object.keys(preProps);
  const nextKeys = Object.keys(nextProps);

  preKeys.forEach((key) => {
    if (key === "children") {
      return;
    }
    if (key.startsWith("on")) {
      el.removeEventListener(key.substring(2).toLowerCase(), nextProps[key]);
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

const createAskrNode = (miraElement: MiraElement): AskrNode | null => {
  // 判断是否为函数组件 或对象
  const element: MiraElement | null = util.isFn(miraElement.type)
    ? (miraElement.type as FC<Props>)(miraElement.props)
    : miraElement;

  if (!element) return null;

  // 渲染节点
  const { type, props } = element;
  const el =
    type === ""
      ? document.createTextNode("")
      : document.createElement(type as string);

  // dom节点属赋值
  updatePropsForDomEl({}, props, el as DOM);

  const children = props.children || [];
  // 递归生成子节点的dom和node
  const kids: Array<AskrNode> = children.map((child) => createAskrNode(child));
  // 插入dom
  kids.forEach((kid) => el.appendChild(kid.dom));

  const askrNode: AskrNode = {
    miraElement: element,
    dom: el as DOM,
    children: kids,
  };

  return askrNode;
};

function reconcile(
  parent: DOM,
  askrNode: AskrNode | null,
  miraElement: MiraElement,
): AskrNode | null {
  if (!parent) return null;
  // 类型相同复用dom
  if (askrNode?.miraElement?.type === miraElement.type) {
    updatePropsForDomEl(
      askrNode.miraElement.props,
      miraElement.props,
      askrNode.dom,
    );
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
}

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
