<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">{{ text.title }}</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <b-button
          @click="$router.push('texts')"
          variant="success"
          class="float-right mr-2"
          ><b-icon-arrow-left />
        </b-button>
      </div>
    </div>
    <div class="row">
      <div v-html="text.content" class="col-md-12"></div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    id: {
      require: true,
      type: String
    }
  },
  created() {
    this.loadText(this.id);
  },
  computed: {
    ...mapGetters("texts", ["text"])
  },
  methods: {
    ...mapActions("texts", ["loadText"])
  }
};
</script>
