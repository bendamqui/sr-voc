export const arrayIterator = function(array) {
  let position = 0;
  return {
    value: undefined,
    next() {
      return (this.value = array[position++]);
    },
    hasMore() {
      return position < array.length;
    },
    reset() {
      position = 0;
      this.value = undefined;
    },
    length: array.length
  };
};
