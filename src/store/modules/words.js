import { ResultsLog, Words } from "@/pouch";
import Chart from "chart.js";

const state = () => ({
  words: [],
  difficultWords: [],
  wordsToReviewCount: 0,
  wordsByLevel: []
});

const getters = {
  words(state) {
    return state.words;
  },
  wordsByLevelToChart(state) {
    return {
      labels: state.wordsByLevel.map(({ key }) => `Level ${key}`),
      datasets: [
        {
          data: state.wordsByLevel.map(({ value }) => value),
          backgroundColor: Chart["colorschemes"].tableau.Tableau10,
          borderWidth: 1
        }
      ]
    };
  },
  difficultWords(state) {
    return state.difficultWords;
  },
  wordsToReviewCount(state) {
    return state.wordsToReviewCount;
  }
};

const actions = {
  loadWords({ commit }) {
    return Words.find({
      selector: { level: { $gte: -1 } },
      include_docs: true
    }).then(docs => commit("setWords", docs));
  },
  fetchWordsByLevel({ commit }) {
    return Words.query(
      {
        map: function(doc, emit) {
          emit(doc.level);
        },
        reduce: "_count"
      },
      { reduce: true, group: true }
    ).then(({ rows }) => {
      commit("setWordsByLevel", rows);
    });
  },
  async loadDifficultWords({ commit }) {
    const { rows: stats } = await ResultsLog.query({
      map: function(doc, emit) {
        const attempts = doc.log.length;
        const sum = doc.log.reduce(
          (acc, { result }) => acc + (result ? 1 : 0),
          0
        );
        const ratio = sum / attempts;
        if (ratio < 0.7) {
          emit(doc._id, [{ attempts, sum, ratio }]);
        }
      }
    });
    const statsMap = stats.reduce((acc, value) => {
      acc[value.key] = value;
      return acc;
    }, {});
    const { docs: words } = await Words.find({
      selector: {
        _id: { $in: stats.map(({ key }) => key) }
      }
    });
    const res = words.map(word => {
      word.value = statsMap[word._id].value[0];
      return word;
    });
    commit("setDifficultWords", res);
  },
  async loadWordsToReviewCount({ commit, rootGetters }) {
    const query = await rootGetters["settings/toPouchReviewQuery"];
    return Words.find(query).then(({ docs }) => {
      commit("setWordsToReviewCount", docs.length);
    });
  },
  deleteWord({ dispatch }, doc) {
    Words.put({ ...doc, _deleted: true }).then(() => {
      dispatch("loadWords");
    });
  }
};

const mutations = {
  setWords(state, { docs }) {
    state.words = docs;
  },
  setWordsByLevel(state, data) {
    state.wordsByLevel = data;
  },
  setDifficultWords(state, words) {
    state.difficultWords = words;
  },
  setWordsToReviewCount(state, count) {
    state.wordsToReviewCount = count;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
