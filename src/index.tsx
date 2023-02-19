/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 14:15:59
 * @LastEditTime: 2021-08-10 11:13:41
 * @Description: 开发用
 */
import mira from "./core/jsx";
import { render } from "./core";
import App from "./App";

// const test = <>{"if not clear root, this will appear."}</>;
// render(test, document.querySelector("#root")!);

render(<App />, document.querySelector("#root"));

// console.log(test);
