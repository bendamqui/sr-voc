import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/dashboard.css";
import { mapActions } from "vuex";
import { format } from "date-fns";
import { sequelize } from "@/sqlite";

(async () => {
  await sequelize
    .authenticate()
    .then(() => console.log("authenticated to sqlite"))
    .catch(err => console.log(err));

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
