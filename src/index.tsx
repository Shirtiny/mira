/*
 * @Author: Shirtiny
 * @Date: 2021-08-05 14:15:59
 * @LastEditTime: 2021-08-10 11:13:41
 * @Description: 开发用
 */
import mira from "./core/jsx";
import { render } from "./core";
import App from "./App";

// render(<App />, document.querySelector("#root"));

const test = <>{"sd"}</>;

console.log(test);
render(test, document.querySelector("#root")!);

// 在canvas上绘制图片
const a = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
  img.src = "https://pic.cnblogs.com/avatar/1040921/20210110173340.png";
};

// 使用某个js库压缩html
const compressHtml = () => {
  const html: HTMLTextAreaElement | null = document.querySelector("#html");
  if (html != null) {
    console.log(html.value);
  }
};
