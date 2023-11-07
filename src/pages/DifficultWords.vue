<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">
        Difficult Words
        <b-badge variant="success" pill>{{ difficultWords.length }}</b-badge>
      </h1>
    </div>
    <div class="row">
      <div class="col-12">
        <b-table :items="difficultWords" :fields="fields" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  created() {
    this.loadDifficultWords();
  },
  data() {
    return {
      debug: [],
      checked: [],
      payload: { source: "", target: "", pronunciation: "" },
      fields: [
        { key: "source", sortable: true },
        { key: "target", sortable: true },
        { key: "pronunciation", sortable: true },
        { key: "level", sortable: true },
        { key: "value.sum", label: "Success", sortable: true },
        { key: "value.attempts", label: "Attempts", sortable: true },
        {
          key: "value.ratio",
          label: "Ratio %",
          sortable: true,
          formatter: value => Math.round(value * 100)
        }
      ]
    };
  },
  computed: {
    ...mapGetters("words", ["difficultWords"])
  },
  methods: {
    ...mapActions("words", ["loadDifficultWords"]),
    async sandbox() {}
  }
};
</script>
