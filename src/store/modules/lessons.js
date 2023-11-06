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
  },
  words(state) {
    return state.words;
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
  createWord({ dispatch }, payload) {
    return Words.put(objectToDocument(payload))
      .then(() => dispatch("loadWords", payload.lesson_id))
      .catch(e => console.log(e));
  },
  loadWords({ commit }, lessonId) {
    return Words.find({
      selector: { lesson_id: lessonId },
      include_docs: true
    }).then(docs => {
      commit("setWords", docs);
    });
  },
  deleteWords({ dispatch }, doc) {
    return Words.put({ ...doc, _deleted: true }).then(() => {
      dispatch("loadWords", doc.lesson_id);
    });
  },
  updateWord({ dispatch }, doc) {
    return Words.put(objectToDocument(doc)).then(() =>
      dispatch("loadWords", doc.lesson_id)
    );
  }
};

const mutations = {
  setLessons(state, { rows }) {
    state.lessons = rows.map(({ doc }) => doc);
  },
  setLesson(state, doc) {
    state.lesson = doc;
  },
  setWords(state, { docs }) {
    state.words = docs;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
