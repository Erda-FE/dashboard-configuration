import React, { useRef, useState, useLayoutEffect } from 'react';
import { useSize } from 'react-use';

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
