/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 14:54:27
 * @LastEditTime: 2021-08-10 17:33:30
 * @Description: core类型
 */

export type DOM = HTMLElement | SVGElement;

export interface AskrNode {
  miraElement: MiraElement;
  dom: RenderTarget;
  kids: Array<AskrNode>;
}

export type RenderTarget = Element | Text | DocumentFragment | null;

// for conditional rendering we support boolean child element e.g cond && <tag />
export type JsxChild =
  | MiraElement
  | string
  | number
  | boolean
  | undefined
  | null;

export interface IProps extends Record<string, any> {
  children?: JsxChild[];
}

// 函数式
export interface FC<P extends IProps = {}> {
  (props: P): MiraElement | null;
  tag?: number;
  type?: string;
}
export interface MiraElement<P extends IProps = any, T = string> {
  type: T | FC<P>;
  props: P;
  key?: string;
}

// 暂时不写那么复杂
// 注意创建的元素不只有htmlElement 这里只写通用jsx属性
// 想要定义某个elemName的属性 在IntrinsicElements新增行 格式为元素名称和对应接口
// export interface ICommonJsxAttributes extends Record<string, any> {
//   className?: string;
//   style?: string | CSSStyleDeclaration;
// }

// jsx类型定义
// export declare namespace JSX {
//   interface Element<P extends IProps = any> {
//     type: string | FC<P>;
//     props: P;
//     // key: string; 因为只用来创建 所以不管key
//   }
//   interface IntrinsicElements {
//     [elemName: string]: ICommonJsxAttributes;
//   }
// }
