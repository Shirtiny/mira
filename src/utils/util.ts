import lang from "./lang";

/*
 * @Author: Shirtiny
 * @Date: 2021-08-09 14:11:33
 * @LastEditTime: 2021-08-09 14:23:22
 * @Description:
 */
export function toArray(arg: any) {
  return !arg ? [] : lang.isArray(arg) ? arg : [arg];
}
const util = { toArray };

export default util;
