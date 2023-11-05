import { ResultsLog } from "@/pouch";
import { objectToDocument } from "@/utils/pouch";

const state = () => ({
  results: []
});

const getters = {
  results(state) {
    return state.results;
  }
};

const actions = {
  loadResults({ commit }) {
    return ResultsLog.allDocs({ include_docs: true }).then(docs =>
      commit("setResults", docs)
    );
  },
  createResult(context, payload) {
    return ResultsLog.put(objectToDocument(payload));
  }
};

const mutations = {
  setResults(state, { rows }) {
    state.results = rows.map(({ doc }) => doc);
  }
};

export default { namespaced: true, state, getters, actions, mutations };
