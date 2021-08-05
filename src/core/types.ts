/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 14:54:27
 * @LastEditTime: 2021-08-05 16:58:36
 * @Description: core类型
 */

export interface Props {
  children?: Array<any>;
  [key: string]: any;
}

export interface MiraElement {
  type: string;
  props: Props;
}
