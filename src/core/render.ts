/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 15:00:12
 * @LastEditTime: 2021-08-08 14:33:34
 * @Description: 渲染
 */

import { FC, Instance, Props } from "./types";

/**
 * @description: 判断是否为函数
 * @param {any} arg
 * @return {Boolean}
 */
const isFn = (arg: any): boolean => typeof arg === "function";

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
 * @param {Instance} miraElement 虚拟元素
 * @param {Element} parent dom
 * @return {void}
 */
const render = (instance: Instance | string, parent: Element | null): void => {
  if (!parent) return;
  // 为字符串时 创建文本节点
  if (typeof instance === "string") {
    const textNode = document.createTextNode(instance);
    parent.appendChild(textNode);
    return;
  }

  // 判断是否为函数组件
  const miraElement = isFn(instance.type)
    ? (instance.type as FC<Props>)(instance.props)
    : instance;

  if (!miraElement) return;

  // 渲染节点
  const { type, props } = miraElement;
  const el = document.createElement(type as string);
  setPropsForDomEl(props, el);
  const children = props.children || [];
  // 递归渲染子节点
  children.forEach((child: string | Instance) => render(child, el));
  parent.appendChild(el);
};

export default render;
