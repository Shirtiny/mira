/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 15:00:12
 * @LastEditTime: 2021-08-05 17:57:52
 * @Description: 渲染
 */

import { MiraElement, Props } from "./types";

/**
 * @description:
 * @param {Props} props
 * @return {void}
 */
const setPropsForDomEl = (props?: Props, el?: Element): void => {
  if (!props || !el) return;
  const keys = Object.keys(props);

  keys.forEach((key) => {
    if (key === "children") {
      return;
    }
    if (key.startsWith("on")) {
      el.addEventListener(key.substring(2).toLowerCase(), props[key]);
    } else {
      el.setAttribute(key, props[key]);
    }
  });
};

/**
 * @description：将虚拟元素节点渲染为dom节点
 * @param {MiraElement} miraElement 虚拟元素
 * @param {Element} parent dom
 * @return {*}
 */
const render = (miraElement: MiraElement | string, parent: Element | null) => {
  if (!parent) return;
  // 为字符串时 创建文本节点
  if (typeof miraElement === "string") {
    const textNode = document.createTextNode(miraElement);
    parent.appendChild(textNode);
    return;
  }
  // 渲染节点
  const { type, props } = miraElement;
  const el = document.createElement(type);
  setPropsForDomEl(props, el);
  const children = props.children || [];
  // 递归渲染子节点
  children.forEach((child) => render(child, el));
  parent.appendChild(el);
};

export default render;
