/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 14:40:58
 * @LastEditTime: 2021-08-05 18:24:40
 * @Description: 核心模块
 */
import render from "./render";
import { MiraElement, Props } from "./types";

const createElement = (
  type: string,
  props: Props,
  ...children: Array<MiraElement | string>
) => {
  props.children = children || [];
  return {
    type,
    props,
  };
};

const core = {
  render,
  createElement,
};

export default core;
