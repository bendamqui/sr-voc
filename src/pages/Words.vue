<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Words ({{ words.length }})</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <b-button
          @click="deleteWords(checked)"
          variant="danger"
          class="float-right"
          ><b-icon-trash
        /></b-button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <b-table :items="words" :fields="fields">
          <template #head(id)>
            <b-checkbox @change="toggleCheckAll" />
          </template>
          <template #cell(id)="data">
            <b-checkbox v-model="checked" :value="data.value" />
          </template>
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
    this.loadWords();
  },
  data() {
    return {
      checked: [],
      payload: { source: "", target: "", pronunciation: "" },
      fields: [
        "id",
        "source",
        "target",
        "pronunciation",
        "level",
        "lastAttempt",
        "createdAt",
        "updatedAt"
      ]
    };
  },
  computed: {
    ...mapGetters("words", ["words"])
  },
  methods: {
    ...mapActions("words", ["loadWords", "createWord", "deleteWords"]),
    toggleCheckAll(checked) {
      this.checked =
        this.checked.length < this.words.length && checked === true
          ? this.words.map(({ id }) => id)
          : [];
    },
    handleSubmit() {
      this.createWord(this.payload).then(() => (this.payload.name = ""));
    }
  }
};
</script>
