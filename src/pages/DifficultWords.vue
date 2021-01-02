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
        <b-table :items="difficultWords" :fields="fields">
          <template #cell(lastAttempt)="data">
            <span v-date="data.value"> </span>
          </template>
          <template #cell(createdAt)="data">
            <span v-date="data.value"> </span>
          </template>
          <template #cell(updatedAt)="data">
            <span v-date="data.value"> </span>
          </template>
        </b-table>
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
      checked: [],
      payload: { source: "", target: "", pronunciation: "" },
      fields: [
        "source",
        "target",
        "pronunciation",
        "level",
        "Results.success",
        "Results.attempts",
        "Results.ratio"
      ]
    };
  },
  computed: {
    ...mapGetters("words", ["difficultWords"])
  },
  methods: {
    ...mapActions("words", ["loadDifficultWords"])
  }
};
</script>
