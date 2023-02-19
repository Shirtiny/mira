import dom from "./dom";
import { RenderTarget, MiraElement, AskrNode } from "./types";
import reconcile from "./reconcile";

const renderElementIntoContainer = (
  container: RenderTarget,
  askrNode: AskrNode,
): void => {
  if (!container || !askrNode) return;
  // 清空容器
  dom.clearContainer(container);
  reconcile(askrNode);
  dom.append(container, ...Array.from(askrNode.stateNode?.childNodes || []));
};

/**
 * @description：将虚拟元素节点渲染为dom节点
 * @param {MiraElement} miraElement 虚拟元素
 * @param {Element} container dom
 * @return {void}
 */
const render = (miraElement: MiraElement, container: Element | null): void => {
  if (!container) return;
  const rootAskrNode: AskrNode = {
    stateNode: container,
    pendingProps: {
      children: [miraElement],
    },
  };

  // const preNode = rootAskrNode;
  const nextNode = renderElementIntoContainer(
    container,
    rootAskrNode,
    // miraElement,
  );
};

export default render;
