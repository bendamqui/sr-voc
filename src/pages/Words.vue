<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">
        Words <b-badge variant="success" pill>{{ words.length }}</b-badge>
      </h1>
    </div>
    <div class="row">
      <div class="col-12">
        <b-table :items="words" :fields="fields">
          <template #cell(actions)="{item}">
            <b-button
              @click="deleteWord(item)"
              size="sm"
              variant="danger"
              class="mt-1 text-white"
              ><b-icon icon="trash" aria-label="Help"></b-icon>
            </b-button>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { formatDate } from "@/utils/date";

export default {
  created() {
    this.loadWords();
  },
  data() {
    return {
      checked: [],
      payload: { source: "", target: "", pronunciation: "" },
      fields: [
        { key: "source", sortable: true },
        { key: "target", sortable: true },
        { key: "pronunciation", sortable: true },
        { key: "level", sortable: true },
        { key: "last_attempt", sortable: true, formatter: formatDate },
        { key: "created_at", sortable: true, formatter: formatDate },
        { key: "updated_at", sortable: true, formatter: formatDate },
        { key: "Actions" }
      ]
    };
  },
  computed: {
    ...mapGetters("words", ["words"])
  },
  methods: {
    ...mapActions("words", ["loadWords", "deleteWord"])
  }
};
</script>
