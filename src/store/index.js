import Vue from "vue";
import Vuex from "vuex";
import lessons from "@/store/modules/lessons";
import words from "@/store/modules/words";
import dictionary from "@/store/modules/dictionary";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { lessons, words, dictionary }
});
