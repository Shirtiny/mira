/*
 * @Author: Shirtiny
 * @Date: 2021-08-06 16:19:56
 * @LastEditTime: 2021-08-23 17:48:44
 * @Description:
 */

import mira from "./core/jsx";
import "./style/index.scss";

const list = [0, 1, 2, 3];

const List = () => {
  return (
    <ul className="list">
      {list.map((v) => (
        <li className="item">{v}</li>
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
