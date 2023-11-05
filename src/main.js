import Vue from "vue";
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "vue-multiselect/dist/vue-multiselect.min.css";
import "chartjs-plugin-colorschemes";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/dashboard.css";
import { mapActions } from "vuex";
import { format } from "date-fns";
import { sequelize, sync } from "./sqlite";
import PouchDB from "pouchdb-browser";
import find from "pouchdb-find";
import { Words } from "@/pouch";
(async () => {
  PouchDB.plugin(find);
  Words.createIndex({
    index: {
      fields: ["lesson_id"]
    }
  });
  await store.dispatch("settings/init");
  await sequelize
    .authenticate()
    .then(() => console.log("authenticated to sqlite"))
    .catch(err => console.log(err));
  await sync();

  Vue.use(BootstrapVue);
  Vue.use(IconsPlugin);
  Vue.use(VueQuillEditor /* { default global options } */);
  Vue.config.productionTip = false;

  Vue.directive("date", {
    bind(el, binding) {
      if (binding.value) {
        el.innerHTML = format(new Date(binding.value), "yyyy-MM-dd HH:mm:ss");
      }
    }
  });

  new Vue({
    router,
    store,
    render: h => h(App),
    data: () => ({ worker: undefined }),
    async created() {
      await this.fetch();
      await this.loadWordsToReviewCount();
      this.worker = setInterval(() => {
        this.loadWordsToReviewCount();
      }, 1000 * 5);
    },
    beforeDestroy() {
      clearInterval(this.worker);
    },
    methods: {
      ...mapActions("words", ["loadWordsToReviewCount"]),
      ...mapActions("settings", ["fetch"])
    }
  }).$mount("#app");
})();
