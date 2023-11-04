import { Lessons } from "@/pouch";
import { objectToDocument } from "@/utils/pouch";

const state = () => ({
  lessons: []
});

const getters = {
  lessons(state) {
    return state.lessons;
  },
  getLesson(state) {
    return id => {
      return state.lessons.find(lesson => lesson.id === id);
    };
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
  }
};

const mutations = {
  setLessons(state, { rows }) {
    state.lessons = rows.map(({ doc }) => doc);
  }
};

export default { namespaced: true, state, getters, actions, mutations };
