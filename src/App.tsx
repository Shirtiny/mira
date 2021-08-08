/*
 * @Author: Shirtiny
 * @Date: 2021-08-06 16:19:56
 * @LastEditTime: 2021-08-08 14:02:20
 * @Description:
 */

import * as Mira from "./core";

const stories = [
  { name: "Didact introduction", url: "http://bit.ly/2pX7HNn" },
  { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
  { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
  { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" },
  { name: "Components and state", url: "http://bit.ly/2rE16nh" }
];

function storyElement({ name, url }) {
  const likes = Math.ceil(Math.random() * 100);
  return (
    <li>
      <button>{likes}❤️</button>
      <a href={url}>{name}</a>
    </li>
  );
}

const AppElement = <div><ul>{stories.map(storyElement)}</ul></div>;

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
      <AppElement />
      {/* <h1>dd</h1>
      <List /> */}
    </div>
  );
};

export default App;
