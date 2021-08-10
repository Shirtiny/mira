/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 14:54:27
 * @LastEditTime: 2021-08-10 17:33:30
 * @Description: core类型
 */

export type DOM = HTMLElement | SVGElement;

export interface Props extends Record<string, any> {
  children?: Array<any>;
}

export interface MiraElement<P extends Props = any, T = string> {
  type: T | FC<P>;
  props: P;
  key: string;
}

export interface FC<P extends Props = {}> {
  (props: P): MiraElement<P> | null;
  tag?: number;
  type?: string;
}

export interface AskrNode {
  miraElement: MiraElement;
  dom: DOM;
  kids: Array<AskrNode>;
}
