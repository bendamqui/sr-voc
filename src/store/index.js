import Vue from "vue";
import Vuex from "vuex";
import lessons from "@/store/modules/lessons";
import words from "@/store/modules/words";
import dictionary from "@/store/modules/dictionary";
import texts from "@/store/modules/texts";
import annotations from "@/store/modules/annotations";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { lessons, words, dictionary, texts, annotations }
});
