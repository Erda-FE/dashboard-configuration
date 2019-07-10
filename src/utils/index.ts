export const generateUUID = () => {
  let d = new Date().getTime();
  // 只用8位够了
  const uuid = 'xxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line
    const r = (d + (Math.random() * 16)) % 16 | 0;
    d = Math.floor(d / 16);
    // eslint-disable-next-line
    return (c === 'x' ? r : ((r & 0x7) | 0x8)).toString(16);
  });
  return uuid;
};
