import React, { useRef, useState, useLayoutEffect } from 'react';
import { useSize, useSetState, useUnmount } from 'react-use';

export const useForceUpdate = () => {
  const forceUpdate = useState(0)[1];
  return useRef(() => forceUpdate(v => v + 1)).current;
};

export const useForceUpdateWithCallback = (cb: () => void): () => void => {
  const [value, setValue] = useState(0);
  const isUpdating = useRef(0);
  useLayoutEffect(() => {
    if (isUpdating.current) {
      isUpdating.current = 0;
      cb();
    }
  }, [cb, value]);
  return useRef(() => {
    isUpdating.current = 1;
    setValue(v => v + 1);
  }).current;
};

export const useComponentWidth = () => {
  const [sized, { width }] = useSize(
    () => <div style={{ width: '100%' }} />
  );
  return [sized, width];
};

type UpdateFn<T> = (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void;
type UpdatePartFn<U> = (patch: U | Function) => void;

type UpdaterFn<T> = {
  [K in keyof T]: UpdatePartFn<T[K]>
};

type NullableValue<T> = {
  [K in keyof T]: T[K] extends null ? null | { [p: string]: any } // 初始状态里对象值可能是null
    : T[K] extends never[] ? any[] // 初始值是空数组，则认为可放任意结构数组
      : T[K] extends any[] ? T[K] // 初始值是有值的数组
        : T[K] extends object ? { [p: string]: any } : T[K] // 如果是对象类型，不限制内部结构，是object类型即可
};

type ResetFn = () => void;

/* eslint-disable arrow-parens */
/**
 * 状态更新
 * @param initState 初始状态
 * @return [state, updateAll, updater]
 */
export const useUpdate = <T extends object>(
  initState: NullableValue<T>
): [NullableValue<T>, UpdaterFn<NullableValue<T>>, UpdateFn<NullableValue<T>>, ResetFn] => {
  const [state, _update] = useSetState<NullableValue<T>>(initState || {});
  // 使用ref，避免updater的更新方法中，在闭包里使用上次的state
  const ref = React.useRef(state);
  const updateRef = React.useRef(_update);
  ref.current = state;

  const update: any = React.useCallback((args: any) => updateRef.current(args), []);

  const updater: any = React.useMemo(() => {
    const result = {};
    Object.keys(ref.current).forEach((k) => {
      result[k] = (patch: Function | any) => {
        const newPart = patch instanceof Function ? patch(ref.current[k], ref.current) : patch;
        ref.current[k] = newPart;
        // tslint:disable-next-line:no-object-literal-type-assertion
        return updateRef.current({ [k]: newPart } as Partial<NullableValue<T>>);
      };
    });
    return result;
  }, []);

  const reset = React.useCallback(() => updateRef.current(initState), [initState]);

  useUnmount(() => {
    updateRef.current = () => {};
  });

  return [state, updater, update, reset];
};
/* eslint-disable arrow-parens */
