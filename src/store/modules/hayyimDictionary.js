import { HayyimDictionary } from "@/sqlite";

const state = () => ({
  words: []
});

const getters = {
  words(state) {
    return state.words;
  }
};

const actions = {
  search({ commit }, query) {
    return HayyimDictionary.findAll({
      where: { word: query },
      raw: true
    }).then(words => commit("setWords", words));
  }
};

const mutations = {
  setWords(state, words) {
    state.words = words;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
