import { Op } from "sequelize";
import { Word } from "@/sqlite";

const state = () => ({
  words: [],
  difficultWords: [],
  wordsToReviewCount: 0
});

const getters = {
  words(state) {
    return state.words;
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
  loadDifficultWords({ commit }) {
    return Word.selectDifficult().then(docs =>
      commit("setDifficultWords", docs)
    );
  },
  loadWordsToReviewCount({ commit }) {
    return Word.selectWordsToReview().then(words => {
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
  setDifficultWords(state, words) {
    state.difficultWords = words;
  },
  setWordsToReviewCount(state, count) {
    state.wordsToReviewCount = count;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
