export const ImmutableArray = array => {
  const toArray = () => array;
  const extract = index => {
    return ImmutableArray([
      ...array.slice(0, index),
      ...array.slice(index + 1)
    ]);
  };
  const map = fn => {
    return ImmutableArray(array.map(fn));
  };
  return { extract, map, toArray };
};
