export const objectToDocument = obj => ({
  _id: crypto.randomUUID(),
  created_at: Date.now(),
  ...obj,
  updated_at: Date.now()
});

const periodToMillisecond = (period, value) => {
  switch (period) {
    case "hour":
      return 60 * 60 * 1000 * value;
    case "day":
      return 60 * 60 * 24 * 1000 * value;
    case "month":
      return 60 * 60 * 24 * 30 * 1000 * value;
    case "year":
      return 60 * 60 * 24 * 365 * 1000 * value;
  }
};

export const settingsToReviewQuery = settings => {
  const opMap = {
    "=": "$eq",
    ">": "$gt"
  };
  return {
    selector: {
      $or: settings.map(({ operator, level, period, value }) => {
        return {
          level: { [opMap[operator]]: level },
          last_attempt: { $lt: Date.now() - periodToMillisecond(period, value) }
        };
      })
    }
  };
};
