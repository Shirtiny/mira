/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 14:40:58
 * @LastEditTime: 2021-08-09 16:03:06
 * @Description: 核心模块
 */
import util from "../utils/util";
import render from "./render";
import { MiraElement, Props } from "./types";

export const createTextElement = (v?: any) =>
  ({ type: "", props: { nodeValue: v + "" } } as MiraElement);

const createElement = (
  type: string,
  elmentProps: any,
  ...childElements: any[]
): MiraElement => {
  const props = Object.assign({}, elmentProps);
  const children = childElements.length > 0 ? [].concat(...childElements) : [];
  props.children = children
    .filter((c) => c != null && c !== false)
    .map((c: any) => {
      return util.isText(c) ? createTextElement(c) : c;
    });
  return {
    type,
    props,
    key: "",
  };
};

const Fragment = (props: Props) => props.children;

export { render, createElement, Fragment };

const core = {
  render,
  createElement,
  Fragment,
};

export default core;
