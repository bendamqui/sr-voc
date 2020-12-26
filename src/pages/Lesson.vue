<template>
  <div>
    <b-modal @ok="handleEditWord" id="edit-word-modal" title="Edit word">
      <p class="my-4">
        <b-form @submit.prevent="handleEditWord">
          <b-form-group>
            <b-form-input placeholder="source" v-model="editPayload.source" />
          </b-form-group>
          <b-form-group>
            <b-form-input placeholder="target" v-model="editPayload.target" />
          </b-form-group>
          <b-button type="submit" class="d-none" />
        </b-form>
      </p>
    </b-modal>
    <learn :lessonId="id" />
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">{{ lesson.name }}</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <b-button variant="info" class="mr-2" v-b-modal.full-screen-modal
          >Learn</b-button
        >
        <b-button
          @click="deleteWords(checked)"
          variant="danger"
          class="float-right"
          ><b-icon-trash
        /></b-button>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-8">
        <form @submit.prevent="handleSubmit" class="form-inline">
          <b-form-input
            ref="source"
            type="text"
            v-model="payload.source"
            class="mr-2"
            placeholder="Source"
          />
          <b-form-input
            type="text"
            v-model="payload.target"
            class="mr-2"
            placeholder="Target"
          />
          <b-form-input
            type="text"
            v-model="payload.pronunciation"
            class="mr-2"
            placeholder="Pronunciation"
          />
          <b-button type="submit" variant="success" class="float-right">
            <b-icon-plus-circle />
          </b-button>
        </form>
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
          <template #cell(createdAt)="data">
            <span v-date="data.value"> </span>
          </template>
          <template #cell(updatedAt)="data">
            <span v-date="data.value"> </span>
          </template>
          <template #cell(Actions)="{item}">
            <b-button
              @click="showEditModal(item)"
              size="sm"
              variant="warning"
              class="mt-1 mr-2 text-white"
              ><b-icon icon="pencil" aria-label="Help"></b-icon>
            </b-button>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Learn from "../components/modals/quiz/Learn";
export default {
  components: { Learn },
  props: {
    id: {
      required: true,
      type: [Number, String]
    }
  },
  created() {
    this.loadLessonWords(this.id);
    this.lesson = this.getLesson(this.id);
  },
  data() {
    return {
      lesson: {},
      checked: [],
      payload: { source: "", target: "", pronunciation: "" },
      editPayload: {},
      fields: [
        "id",
        "source",
        "target",
        "pronunciation",
        "createdAt",
        "updatedAt",
        "Actions"
      ]
    };
  },
  computed: {
    ...mapGetters("words", ["words"]),
    ...mapGetters("lessons", ["getLesson"])
  },
  methods: {
    ...mapActions("words", [
      "loadLessonWords",
      "createWord",
      "deleteWords",
      "updateWord"
    ]),

    toggleCheckAll(checked) {
      this.checked =
        this.checked.length < this.words.length && checked === true
          ? this.words.map(({ id }) => id)
          : [];
    },
    handleSubmit() {
      this.createWord({ ...this.payload, lessonId: this.id }).then(() => {
        this.payload = { source: "", target: "", pronunciation: "" };
        this.$refs.source.focus();
      });
    },
    showEditModal(item) {
      this.$bvModal.show("edit-word-modal");
      const { id, source, target } = item;
      this.editPayload = { id, source, target };
    },
    handleEditWord() {
      this.updateWord({
        ...this.editPayload,
        lessonId: this.id
      });
      this.$bvModal.hide("edit-word-modal");
    }
  }
};
</script>
