import { Lesson, Word } from "@/sqlite";
import { Op } from "sequelize";

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
    return Lesson.findAll().then(lessons => commit("setLessons", lessons));
  },
  createLesson({ dispatch }, payload) {
    return Lesson.create(payload).then(() => {
      dispatch("loadLessons");
    });
  },
  updateLesson({ dispatch }, { id, ...payload }) {
    return Lesson.update(payload, { where: { id } }).then(() =>
      dispatch("loadLessons")
    );
  },
  deleteLessons({ dispatch }, ids) {
    return Word.destroy({ where: { LessonId: { [Op.in]: ids } } }).then(() => {
      return Lesson.destroy({ where: { id: { [Op.in]: ids } } }).then(() => {
        dispatch("loadLessons");
      });
    });
  }
};

const mutations = {
  setLessons(state, lessons) {
    state.lessons = lessons;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
