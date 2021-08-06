/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 14:40:58
 * @LastEditTime: 2021-08-06 21:55:38
 * @Description: 核心模块
 */
import render from "./render";
import { MiraElement, Props } from "./types";

const createElement = (
  type: string,
  elmentProps: Props,
  ...childElements: Array<MiraElement | string>
) => {
  // Object.assign 性能比 扩展运算符 高的多
  const props = Object.assign({}, elmentProps);
  // 浅拷贝数组
  props.children = childElements.slice();
  return {
    type,
    props,
  };
};

const Fragment = (props: Props) => props.children;

export { render, createElement, Fragment};

const core = {
  render,
  createElement,
  Fragment
};

export default core;
