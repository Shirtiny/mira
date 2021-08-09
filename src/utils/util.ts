/*
 * @Author: Shirtiny
 * @Date: 2021-08-09 14:11:33
 * @LastEditTime: 2021-08-09 14:23:22
 * @Description:
 */

/**
 * @description:判断是否为text节点的值
 * @param {any} arg
 * @return {Boolean} -eg: arg is number | string
 */
const isText = (arg: any): arg is number | string =>
  typeof arg === "number" || typeof arg === "string";

/**
 * @description: 判断是否为函数
 * @param {any} arg
 * @return {Boolean} -eg: arg is Function
 */
const isFn = (arg: any): arg is Function => typeof arg === "function";

/**
 * @description: 判断是否为对象
 * @param {any} arg
 * @return {Boolean} -eg: arg is Object
 */
const isObject = (arg: any): arg is Object => arg instanceof Object;

const util = {
  isText,
  isFn,
  isObject,
};

export default util;
