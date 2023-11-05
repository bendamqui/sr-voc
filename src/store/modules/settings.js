import PouchDB from "pouchdb-browser";
import { Op } from "sequelize";
import { subDays, subHours, subYears } from "date-fns";

const db = new PouchDB("review_settings");

const getDateFunction = input => {
  switch (input) {
    case "hour":
      return subHours;
    case "day":
      return subDays;
    case "year":
      return subYears;
  }
};

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

const defaultReviewSettings = [
  { level: 1, value: 4, operator: "=", period: "hour" },
  { level: 2, value: 1, operator: "=", period: "day" },
  { level: 3, value: 3, operator: "=", period: "day" },
  { level: 4, value: 7, operator: "=", period: "day" },
  { level: 5, value: 14, operator: "=", period: "day" },
  { level: 6, value: 30, operator: "=", period: "day" },
  { level: 7, value: 90, operator: "=", period: "day" },
  { level: 7, value: 120, operator: ">", period: "day" }
];

const state = () => ({
  review: []
});

const getters = {
  review(state) {
    return state.review.sort((a, b) => a.index - b.index);
  },
  toPouchReviewQuery(state) {
    const opMap = {
      "=": "$eq",
      ">": "$gt"
    };
    return state.review.map(({ operator, level, period, value }) => {
      return {
        level: { [opMap[operator]]: level },
        last_attempt: { $lt: Date.now() - periodToMillisecond(period, value) }
      };
    });
  },
  toSequelizeReviewQuery(state) {
    const opMap = {
      "=": Op.eq,
      ">": Op.gt
    };
    return state.review.map(({ operator, level, period, value }) => {
      switch (period) {
        case "hour":
      }
      return {
        level: { [opMap[operator]]: level },
        lastAttempt: { [Op.lt]: getDateFunction(period)(new Date(), value) }
      };
    });
  }
};

const actions = {
  fetch({ commit }) {
    return db
      .allDocs({ include_docs: true })
      .then(docs => commit("setReview", docs));
  },
  init() {
    return db.allDocs({ include_docs: true }).then(docs => {
      if (docs.total_rows === 0) {
        defaultReviewSettings.forEach((doc, index) => {
          db.post({
            ...doc,
            index
          });
        });
      }
    });
  },
  async save({ dispatch }, settings) {
    await settings.map(async setting => {
      await db.put(setting);
    });
    await dispatch("init");
  }
};

const mutations = {
  setReview(state, { rows }) {
    state.review = rows.map(({ doc }) => doc);
  }
};

export default { namespaced: true, state, getters, actions, mutations };
