import { Texts } from "@/pouch";
import { objectToDocument } from "@/utils/pouch";

const state = () => ({
  texts: [],
  text: ""
});

const getters = {
  texts(state) {
    return state.texts;
  },
  text(state) {
    return state.text;
  }
};

const actions = {
  loadTexts({ commit }) {
    return Texts.allDocs({ include_docs: true }).then(texts =>
      commit("setTexts", texts)
    );
  },
  loadText({ commit }, id) {
    return Texts.get(id).then(doc => commit("setText", doc));
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
  },
  setText(state, doc) {
    state.text = doc;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
