<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">
        Words <b-badge variant="success" pill>{{ words.length }}</b-badge>
      </h1>

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
          <template #cell(LessonId)="{item}">
            <router-link
              :to="{ name: 'lesson', params: { id: item.LessonId } }"
              >{{ item.LessonId }}</router-link
            >
          </template>
          <template #cell(id)="data">
            <b-checkbox v-model="checked" :value="data.value" />
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
    this.loadLessons();
  },
  data() {
    return {
      checked: [],
      payload: { source: "", target: "", pronunciation: "" },
      fields: [
        "id",
        { key: "source", sortable: true },
        { key: "target", sortable: true },
        { key: "pronunciation", sortable: true },
        { key: "level", sortable: true },
        { key: "lesson_id", sortable: true },
        { key: "last_attempt", sortable: true, formatter: formatDate },
        { key: "created_at", sortable: true, formatter: formatDate },
        { key: "updated_at", sortable: true, formatter: formatDate }
      ]
    };
  },
  computed: {
    ...mapGetters("words", ["words"])
  },
  methods: {
    ...mapActions("words", ["loadWords", "createWord", "deleteWords"]),
    ...mapActions("lessons", ["loadLessons"]),
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
