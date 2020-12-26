import Vue from "vue";
import Vuex from "vuex";
import lessons from "@/store/modules/lessons";
import words from "@/store/modules/words";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { lessons, words }
});
