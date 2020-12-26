import { Lesson } from "@/js-store/lesson";
import { Word } from "@/js-store/word";

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
  }
};

const actions = {
  loadLessons({ commit }) {
    return Lesson.select().then(lessons => commit("setLessons", lessons));
  },
  createLesson({ dispatch }, payload) {
    return Lesson.insert(payload).then(() => {
      dispatch("loadLessons");
    });
  },
  updateLesson({ dispatch }, { id, ...payload }) {
    return Lesson.update(payload, { where: { id } }).then(() =>
      dispatch("loadLessons")
    );
  },
  deleteLessons({ dispatch }, ids) {
    return Lesson.remove({ where: { id: { in: ids } } })
      .then(() => {
        return Word.remove({ where: { lessonId: { in: ids } } });
      })
      .then(() => {
        dispatch("loadLessons");
      });
  }
};

const mutations = {
  setLessons(state, lessons) {
    state.lessons = lessons;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
