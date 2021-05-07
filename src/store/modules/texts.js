import { Text } from "@/sqlite";
import { Op } from "sequelize";

const state = () => ({
  texts: []
});

const getters = {
  texts(state) {
    return state.texts;
  },
  text(state) {
    return id => {
      return state.texts.find(text => text.id === id);
    };
  }
};

const actions = {
  loadTexts({ commit }) {
    return Text.findAll({ raw: true }).then(texts => commit("setTexts", texts));
  },
  createText({ dispatch }, payload) {
    return Text.create(payload).then(() => {
      dispatch("loadTexts");
    });
  },
  updateText({ dispatch }, { id, ...payload }) {
    return Text.update(payload, { where: { id } }).then(() =>
      dispatch("loadTexts")
    );
  },
  deleteTexts({ dispatch }, ids) {
    return Text.destroy({ where: { id: { [Op.in]: ids } } }).then(() => {
      dispatch("loadTexts");
    });
  }
};

const mutations = {
  setTexts(state, texts) {
    state.texts = texts;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
