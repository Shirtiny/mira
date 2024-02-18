import lang from "~src/utils/lang";
import { AskrNode, Dispatch, IEffect, Reducer, SetStateAction } from "./types";
import { getCurrentFiber, update } from "./reconcile";

const EMPTY_ARR = [];

let cursor = 0;

export const resetCursor = () => {
  cursor = 0;
};

export const useState = <T>(initState: T): [T, Dispatch<SetStateAction<T>>] => {
  return useReducer(undefined, initState);
};

export const getHook = <S = Function | undefined, Dependency = any>(
  cursor: number,
): [[S, Dependency], AskrNode] => {
  const current = getCurrentFiber()!;

  const hooks =
    current.hooks || (current.hooks = { list: [], effect: [], layout: [] });
  if (cursor >= hooks.list.length) {
    hooks.list.push([] as IEffect);
  }
  return [hooks.list[cursor] as unknown as [S, Dependency], current];
};

export const useReducer = <S, A>(
  reducer?: Reducer<S, A>,
  initState?: S,
): [S, Dispatch<A>] => {
  const [hook, current]: [any, AskrNode] = getHook<S>(cursor++);
  if (hook.length === 0) {
    hook[0] = initState;
    hook[1] = (value: A | Dispatch<A>) => {
      let v = reducer
        ? reducer(hook[0], value as any)
        : lang.isFn(value)
        ? value(hook[0])
        : value;
      if (hook[0] !== v) {
        hook[0] = v;
        update(current);
      }
    };
  }
  return hook;
};
