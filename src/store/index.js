import Vue from "vue";
import Vuex from "vuex";
import lessons from "@/store/modules/lessons";
import words from "@/store/modules/words";
import dictionary from "@/store/modules/dictionary";
import hayyimDictionary from "@/store/modules/hayyimDictionary";
import texts from "@/store/modules/texts";
import annotations from "@/store/modules/annotations";
import settings from "@/store/modules/settings";
import annotatedTexts from "@/store/modules/annotatedTexts";
import resultsLog from "@/store/modules/resultsLog";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    lessons,
    words,
    dictionary,
    texts,
    annotations,
    hayyimDictionary,
    settings,
    annotatedTexts,
    resultsLog
  }
});
