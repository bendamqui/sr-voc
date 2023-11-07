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
  },
  async logResult(context, { _id, result, type, answer }) {
    let document;
    const payload = {
      result,
      type,
      answer,
      created_at: Date.now()
    };
    try {
      document = await ResultsLog.get(_id);
      document.log.push(payload);
    } catch (e) {
      if (e.name === "not_found") {
        document = {
          _id,
          log: [payload]
        };
      } else {
        throw e;
      }
    }
    return ResultsLog.put(objectToDocument(document));
  }
};

const mutations = {
  setResults(state, { rows }) {
    state.results = rows.map(({ doc }) => doc);
  }
};

export default { namespaced: true, state, getters, actions, mutations };
