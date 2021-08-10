/*
 * @Author: Shirtiny
 * @Date: 2021-08-10 17:32:54
 * @LastEditTime: 2021-08-10 18:09:33
 * @Description:
 */

import { Props } from "./types";

interface IComponent<P extends Props = {}> {
  props: P;
  state: Object;
  setState(nextState: Object): void;
}

export class Component implements IComponent {
  props: any;
  state: Object;

  constructor(props: Props) {
    this.props = props;
    this.state = {};
  }

  setState(nextState: Object): void {
    this.state = Object.assign({}, this.state, nextState);
  }
}
