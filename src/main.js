import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/dashboard.css";

import { connection, schema } from "@/js-store";
import { TimeStampPlugin } from "@/js-store/TimestampsPlugin";
import { mapActions } from "vuex";
import { format } from "date-fns";

(async () => {
  Vue.use(BootstrapVue);
  Vue.use(IconsPlugin);
  Vue.config.productionTip = false;
  Vue.directive("date", {
    bind(el, binding) {
      if (binding.value) {
        el.innerHTML = format(binding.value, "yyyy-MM-dd HH:mm:ss");
      }
    }
  });
  connection.addPlugin(TimeStampPlugin);
  await connection.initDb(schema);

  new Vue({
    router,
    store,
    render: h => h(App),
    data: () => ({ worker: undefined }),
    created() {
      this.loadWordsToReviewCount();
      this.worker = setInterval(() => {
        this.loadWordsToReviewCount();
      }, 1000 * 5);
    },
    beforeDestroy() {
      clearInterval(this.worker);
    },
    methods: {
      ...mapActions("words", ["loadWordsToReviewCount"])
    }
  }).$mount("#app");
})();
