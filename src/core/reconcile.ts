import lang from "~src/utils/lang";
import util from "~src/utils/util";
import commit from "./commit";
import dom from "./dom";
import jsx from "./jsx";
import { AskrNode, MiraElement, RenderTarget } from "./types";

let currentEffect: AskrNode | null = null;

const convertToAskr = (element?: MiraElement | null): AskrNode | null => {
  if (!element) return null;
  const { type, props, key } = element;
  if (!props) return null;
  return {
    type,
    elementType: type,
    pendingProps: props,
    key: key,
    ["__askr-node-name"]: lang.isFn(type) ? type.name : type,
  };
};

const updateChildren = (
  askrNode: AskrNode,
  pendingChildren: MiraElement | MiraElement[],
) => {
  // pendingChildren为新的children
  // askrNode.kids为旧的children
  // 先不管children之间的比较
  askrNode.kids = [];
  util.toArray(pendingChildren).forEach((child: MiraElement) => {
    const askrChild = convertToAskr(child);
    if (!askrChild) return;
    askrNode.kids?.push(askrChild);
  });
  for (
    let i = 0, preChild: AskrNode | null = null;
    i < askrNode.kids.length;
    i++
  ) {
    const child = askrNode.kids[i];

    // if (askrNode.lane & TAG.SVG) {
    //   child.lane |= TAG.SVG;
    // }
    child.return = askrNode;

    // child.lastEffect = currentEffect;
    // currentEffect!.nextEffect = child;
    // currentEffect = child;

    if (i > 0) {
      preChild!.sibling = child;
    } else {
      askrNode.child = child;
    }
    preChild = child;
  }
};

const growHostAskr = (askrNode: AskrNode) => {
  if (!askrNode.stateNode) {
    const domNode = dom.createByAskr(askrNode);
    askrNode.stateNode = domNode;
  }
  updateChildren(askrNode, askrNode.pendingProps.children);
};

const growFCAskr = (askr?: AskrNode | null) => {
  if (!askr || !lang.isFn(askr?.elementType)) return;
  const { elementType, pendingProps } = askr;
  const pendingChildren = elementType(pendingProps);
  if (lang.isNullOrUndefined(pendingChildren)) return;
  updateChildren(askr, pendingChildren);
};

const processAskr = (askrNode?: AskrNode | null): AskrNode | null => {
  console.log("reconcile", askrNode);
  if (!askrNode || !askrNode.pendingProps) return null;

  const { elementType } = askrNode;
  // FC
  if (lang.isFn(elementType)) {
    growFCAskr(askrNode);
  } else {
    // elementType 为 text, undefined  root的是undefined
    // update for host element
    growHostAskr(askrNode);
  }

  if (askrNode.child) return askrNode.child;

  while (askrNode) {
    commit(askrNode);
    if (askrNode.sibling) return askrNode.sibling;
    // 没有兄弟节点时
    askrNode = askrNode.return;
  }

  return null;
};

const reconcileImpl = (askrNode?: AskrNode | null) => {
  while (!!askrNode) {
    askrNode = processAskr(askrNode);
  }
  askrNode && reconcileImpl(askrNode);
};

export default (askrNode?: AskrNode | null) => {
  if (!askrNode) return;
  currentEffect = askrNode;
  reconcileImpl(askrNode);
};
