import lang from "~src/utils/lang";
import dom from "./dom";
import { AskrNode, RenderTarget } from "./types";

const deadline = () => performance.now() + 10000;

const shouldYield = (deadlineTime: number): boolean => {
  return performance.now() >= deadlineTime;
};

const searchParentNode = (askerNode?: AskrNode | null): RenderTarget => {
  while (askerNode) {
    askerNode = askerNode.return;
    if (!lang.isFn(askerNode?.elementType)) return askerNode?.stateNode;
  }
  return null;
};

const commit = (askrNode?: AskrNode | null) => {
  const deadTime = deadline();
  if (shouldYield(deadTime)) {
    console.log("timeout");
  }

  if (!askrNode?.stateNode) return;

  console.log("commit", askrNode?.stateNode);
  const parentNode = searchParentNode(askrNode);
  if (parentNode) {
    dom.append(parentNode, askrNode.stateNode);
  }

  // while (askerNode) {

  //   askerNode = askerNode.lastEffect;
  // }
};

export default commit;
