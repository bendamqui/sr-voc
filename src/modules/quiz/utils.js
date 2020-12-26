export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const extractChoices = (pool, answer, n, choices) => {
  choices = choices || [];
  if (n === 0) {
    return shuffle(choices);
  }
  const index = choices.length === 0 ? answer : random(0, pool.length - 1);
  choices.push(pool[index]);
  return extractChoices(
    [...pool.slice(0, index), ...pool.slice(index + 1)],
    answer,
    n - 1,
    choices
  );
};

export const shuffle = (source, target) => {
  target = target || [];
  if (source.length === 0) {
    return target;
  }
  const index = random(0, source.length - 1);
  target.push(source[index]);
  source.splice(index, 1);
  return shuffle(source, target);
};
