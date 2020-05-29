import { useRef, useState, useLayoutEffect } from 'react';

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
