import { Word } from "@/sqlite";
import { Words } from "@/pouch";
import Chart from "chart.js";
import { objectToDocument } from "@/utils/pouch";

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
    return Words.allDocs({ include_docs: true }).then(docs =>
      commit("setWords", docs)
    );
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
    console.log("loadWordsToReviewCount");
    const query = await rootGetters["settings/toPouchReviewQuery"];
    return Words.find({
      selector: {
        $or: query
      }
    }).then(words => {
      commit("setWordsToReviewCount", words.length);
    });
  },
  loadLessonWords({ commit }, lessonId) {
    return Words.find({
      selector: { lesson_id: lessonId },
      include_docs: true
    }).then(docs => {
      commit("setWords", docs);
    });
  },
  updateWord({ dispatch }, doc) {
    return Words.put(objectToDocument(doc)).then(() =>
      dispatch("loadLessonWords", doc.lesson_id)
    );
  },
  createWord({ dispatch }, payload) {
    return Words.put(objectToDocument(payload)).then(() =>
      dispatch("loadLessonWords", payload.lesson_id)
    );
  },
  deleteWords({ dispatch }, doc) {
    return Words.remove(doc).then(() => {
      dispatch("loadLessonWords", doc.lesson_id);
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
