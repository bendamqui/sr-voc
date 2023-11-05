import { Lessons, Words } from "@/pouch";
import { objectToDocument } from "@/utils/pouch";

const state = () => ({
  lessons: [],
  lesson: {},
  words: []
});

const getters = {
  lessons(state) {
    return state.lessons;
  },
  lesson(state) {
    return state.lesson;
  },
  lessonOptions(state) {
    return state.lessons.map(({ id, name }) => ({ id, name }));
  }
};

const actions = {
  loadLessons({ commit }) {
    return Lessons.allDocs({ include_docs: true }).then(docs =>
      commit("setLessons", docs)
    );
  },
  loadLesson({ commit }, id) {
    return Lessons.get(id).then(doc => commit("setLesson", doc));
  },
  createLesson({ dispatch }, payload) {
    return Lessons.put(objectToDocument(payload)).then(() => {
      dispatch("loadLessons");
    });
  },
  updateLesson({ dispatch }, payload) {
    return Lessons.put(objectToDocument(payload)).then(() => {
      dispatch("loadLessons");
    });
  },
  deleteLesson({ dispatch }, doc) {
    return Lessons.remove(doc).then(() => {
      dispatch("loadLessons");
    });
  },
  loadWords({ commit }, lessonId) {
    return Words.find({
      selector: { lesson_id: lessonId },
      include_docs: true
    }).then(docs => {
      commit("setWords", docs);
    });
  }
};

const mutations = {
  setLessons(state, { rows }) {
    state.lessons = rows.map(({ doc }) => doc);
  },
  setLesson(state, doc) {
    state.lesson = doc;
  },
  setWords(state, docs) {
    console.log(docs);
    state.words = docs;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
