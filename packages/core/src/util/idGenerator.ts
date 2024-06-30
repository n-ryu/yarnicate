export const createIdGenerator = (prefix: string) => {
  let id = 0;
  return () => `${prefix}-${id++}`;
};
