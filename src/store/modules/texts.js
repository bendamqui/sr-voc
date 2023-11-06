import { Texts } from "@/pouch";
import { objectToDocument } from "@/utils/pouch";

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
    return Texts.allDocs({ include_docs: true }).then(texts =>
      commit("setTexts", texts)
    );
  },
  createText({ dispatch }, payload) {
    return Texts.put(objectToDocument(payload)).then(() => {
      dispatch("loadTexts");
    });
  },
  updateText({ dispatch }, payload) {
    return Texts.put(objectToDocument(payload)).then(() =>
      dispatch("loadTexts")
    );
  },
  deleteText({ dispatch }, payload) {
    return Texts.put({
      ...payload,
      _deleted: true
    }).then(() => {
      dispatch("loadTexts");
    });
  }
};

const mutations = {
  setTexts(state, { rows }) {
    state.texts = rows.map(({ doc }) => doc);
  }
};

export default { namespaced: true, state, getters, actions, mutations };
