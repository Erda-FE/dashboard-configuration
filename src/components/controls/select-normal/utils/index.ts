export function checkFixedData(str: string) {
  try {
    if (str.indexOf('[') > -1) {
      const fixedData = strToObject(str);
      for (const item of fixedData) {
        const { name, value } = item;
        if (!name || !value) {
          return false;
        }
      }
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}

export function strToObject(str: string) {
  /* eslint-disable */
  return  (new Function(`return ${str}`))();
}
