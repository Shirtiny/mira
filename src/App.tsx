/*
 * @Author: Shirtiny
 * @Date: 2021-08-06 16:19:56
 * @LastEditTime: 2021-08-09 17:31:13
 * @Description:
 */

import * as Mira from "./core";
import "./style/index.scss"

const list = [0, 1, 2, 3];

const handleClick = (list: Array<number>, index: number) => {
  list[index]++;
  console.log(list, index, list[index]);
  Mira.render(<App />, document.querySelector("#root"));
};

const List = () => {
  return (
    <ul className="list">
      {list.map((v, index) => (
        <li className="item" onClick={() => handleClick(list, index)}>{v}</li>
      ))}
    </ul>
  );
};

const App = () => {
  return (
    <div>
      <h1>dd</h1>
      <List />
    </div>
  );
};

export default App;
