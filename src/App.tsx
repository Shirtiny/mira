/*
 * @Author: Shirtiny
 * @Date: 2021-08-06 16:19:56
 * @LastEditTime: 2021-08-09 14:30:41
 * @Description:
 */

import * as Mira from "./core";

const List = () => {
  const list = [0, 1, 2, 3];
  return (
    <ul className="list">
      {list.map((v) => (
        <li>{v}</li>
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
