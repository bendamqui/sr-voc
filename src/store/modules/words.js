import { Op } from "sequelize";
import { Word } from "@/sqlite";
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
  wordsByLevel(state) {
    return {
      labels: state.wordsByLevel.map(({ level }) => `Level ${level}`),
      datasets: [
        {
          data: state.wordsByLevel.map(({ count }) => count),
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
    return Word.findAll({ raw: true }).then(docs => commit("setWords", docs));
  },
  fetchWordsByLevel({ commit }) {
    Word.wordsByLevel()
      .then(data => commit("setWordsByLevel", data))
      .catch(e => console.log(e));
  },
  loadDifficultWords({ commit }) {
    return Word.selectDifficult().then(docs =>
      commit("setDifficultWords", docs)
    );
  },
  async loadWordsToReviewCount({ commit, rootGetters }) {
    const query = await rootGetters["settings/toSequelizeReviewQuery"];
    return Word.selectWordsToReview(query).then(words => {
      commit("setWordsToReviewCount", words.length);
    });
  },
  loadLessonWords({ commit }, lessonId) {
    return Word.findAll({ raw: true, where: { lessonId } }).then(docs =>
      commit("setWords", docs)
    );
  },
  updateWord({ dispatch }, { LessonId, id, ...payload }) {
    return Word.update(payload, { where: { id } }).then(() =>
      dispatch("loadLessonWords", LessonId)
    );
  },
  createWord({ dispatch }, payload) {
    return Word.create(payload).then(() =>
      dispatch("loadLessonWords", payload.LessonId)
    );
  },
  deleteWords({ dispatch }, { ids, LessonId }) {
    return Word.destroy({ where: { id: { [Op.in]: ids } } }).then(() => {
      dispatch("loadLessonWords", LessonId);
    });
  }
};

const mutations = {
  setWords(state, words) {
    state.words = words;
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
