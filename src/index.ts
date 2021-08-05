/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 14:15:59
 * @LastEditTime: 2021-08-05 18:18:38
 * @Description: 开发用
 */
import core from "./core";

const { render, createElement } = core;

render(
  createElement(
    "div",
    { id: "container" },
    createElement("input", { value: "foo", type: "text" }),
    createElement("a", { href: "/bar" }, "bar"),
    createElement("span", { onClick: () => alert("Hi") }, "click me"),
  ),
  document.querySelector("#root"),
);
