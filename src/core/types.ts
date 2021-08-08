/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 14:54:27
 * @LastEditTime: 2021-08-08 13:12:24
 * @Description: core类型
 */

export interface Props extends Record<string, any> {
  children?: Array<any>;
}

export interface MiraElement<P extends Props = any, T = string> {
  type: T;
  props: P;
  key: string;
}

export interface FC<P extends Props = {}> {
  (props: P): MiraElement<P> | null;
  tag?: number;
  type?: string;
}

export interface Instance<P extends Props = any> {
  type: string | FC<P>;
  props: P
}
