/*
 * @Author: Shirtiny
 * @Date: 2021-08-06 16:19:56
 * @LastEditTime: 2021-08-23 17:48:44
 * @Description:
 */

import { useState } from "./core/hooks";
import mira from "./core/jsx";
import "./style/index.scss";

const list = [0, 1, 2, 3];

const List = () => {
  const handleClick = (e: Event, v: any) => {
    console.log(e, v);
  };
  return (
    <ul className="list">
      {list.map((v) => (
        <li className="item" onClick={(e: any) => handleClick(e, v)}>
          {v}
        </li>
      ))}
    </ul>
  );
};

const a = document.createElement("a");
a.textContent = "this is a htmlElement direct create by document.";

const normalTextVariant = "normal text variant";
const userInput = '<img src="x" onerror="alert(\'XSS Attack!\');" />';

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="app">
      <h1>dd {count}</h1>
      <button onClick={() => setCount((v) => v + 1)}>add</button>
      <List />
      <span>{normalTextVariant}</span>
      <br />
      <span>{userInput}</span>
      <br />
      <>Fragment</>
      <br />
      <>{"Fragment2"}</>
      {a}
    </div>
  );
};

export default App;
