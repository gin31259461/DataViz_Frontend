export const omit = (obj: any, ...props: any[]) => {
  const result = { ...obj };
  props.forEach((prop) => {
    delete result[prop];
  });
  return result;
};
