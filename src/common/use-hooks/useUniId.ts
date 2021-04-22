import { useEffect, useRef, useState } from 'react';

const idMap: Map<string, number> = new Map();

const genUniId = (prefix: string): string => {
  !idMap.get(prefix) && idMap.set(prefix, 0);
  let id = idMap.get(prefix) as number;
  const newId = ++id;
  idMap.set(prefix, newId);
  return `${prefix}-${newId}`;
};

export default (prefix = 'uid', deps: readonly any[] = []): string => {
  const [uid, setUid] = useState<string>(() => genUniId(prefix));
  const firstRender = useRef<boolean>(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setUid(genUniId(prefix));
  }, [prefix, ...deps]);

  return uid;
};
