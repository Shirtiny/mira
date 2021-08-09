/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 15:00:12
 * @LastEditTime: 2021-08-09 15:57:59
 * @Description: 渲染
 */

import { DOM, FC, MiraElement, Props } from "./types";
import util from "../utils/util";

let rootAskrNode = null;

/**
 * @description:
 * @param {Props} props
 * @return {void}
 */
const setPropsForDomEl = (props: Props, el: DOM): void => {
  const keys = Object.keys(props);

  keys.forEach((key) => {
    if (key === "children") {
      return;
    }
    if (key.startsWith("on")) {
      el.addEventListener(key.substring(2).toLowerCase(), props[key]);
    } else {
      (<any>el)[key] = props[key];
    }
  });
};

/**
 * @description：将虚拟元素节点渲染为dom节点
 * @param {MiraElement} miraElement 虚拟元素
 * @param {Element} parent dom
 * @return {void}
 */
const render = (miraElement: MiraElement, parent: DOM | null): void => {
  if (!parent) return;

  // 判断是否为函数组件 或对象
  const element: MiraElement | null = util.isFn(miraElement.type)
    ? (miraElement.type as FC<Props>)(miraElement.props)
    : miraElement;

  if (!element) return;

  // 渲染节点
  const { type, props } = element;
  const el =
    type === ""
      ? document.createTextNode("")
      : document.createElement(type as string);
  setPropsForDomEl(props, el as DOM);
  const children = props.children || [];
  // 递归渲染子节点
  children.forEach((child) => render(child, el as DOM));
  parent.appendChild(el);
};

export default render;
