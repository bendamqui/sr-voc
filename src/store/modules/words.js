import { connection } from "@/js-store";
import { Word } from "@/js-store/word";

const state = () => ({
  words: [],
  wordsToReviewCount: 0
});

const getters = {
  words(state) {
    return state.words;
  },
  wordsToReviewCount(state) {
    return state.wordsToReviewCount;
  }
};

const actions = {
  loadWords({ commit }) {
    return Word.select().then(docs => commit("setWords", docs));
  },
  loadDifficultWords({ commit }) {
    return Word.selectDifficult().then(docs => commit("setWords", docs));
  },
  loadWordsToReviewCount({ commit }) {
    return Word.selectWordsToReview().then(words =>
      commit("setWordsToReviewCount", words.length)
    );
  },
  loadLessonWords({ commit }, lessonId) {
    return connection
      .select({ from: "words", where: { lessonId } })
      .then(docs => commit("setWords", docs));
  },
  updateWord({ dispatch }, { lessonId, id, ...payload }) {
    return Word.update(payload, { where: { id } }).then(() =>
      dispatch("loadLessonWords", lessonId)
    );
  },
  createWord({ dispatch }, payload) {
    return connection
      .insert({ into: "words", values: [payload] })
      .then(() => dispatch("loadLessonWords", payload.lessonId));
  },
  deleteWords({ dispatch }, ids) {
    return connection
      .remove({ from: "words", where: { id: { in: ids } } })
      .then(() => {
        dispatch("loadWords");
      });
  }
};

const mutations = {
  setWords(state, words) {
    state.words = words;
  },
  setWordsToReviewCount(state, count) {
    state.wordsToReviewCount = count;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
