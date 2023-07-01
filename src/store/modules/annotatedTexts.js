import { texts } from "@/pouch";
import { textToPayload } from "@/utils/annotatedText";

const state = () => ({
  texts: [],
  text: {}
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
  fetchText({ commit }, id) {
    return texts.get(id).then(response => commit("setText", response));
  },
  fetchTexts({ commit }) {
    texts
      .allDocs({ include_docs: true })
      .then(response => commit("setTexts", response));
  },
  createText(context, payload) {
    return textToPayload(payload.content).then(content => {
      return texts.put({
        ...payload,
        content,
        _id: crypto.randomUUID(),
        created_at: Date().toString(),
        updated_at: Date().toString()
      });
    });
  },
  updateText(context, payload) {
    return textToPayload(payload.content).then(content => {
      return texts.put({
        ...payload,
        content,
        updated_at: Date().toString()
      });
    });
  },
  deleteTexts({ dispatch }, payload) {
    texts
      .bulkDocs(payload.map(({ _id, _rev }) => ({ _id, _rev, _deleted: true })))
      .then(() => dispatch("fetchTexts"));
  }
};

const mutations = {
  setTexts(state, { rows }) {
    state.texts = rows.map(({ doc }) => doc);
  },
  setText(state, text) {
    state.text = text;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
