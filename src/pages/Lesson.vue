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
          <b-form-group>
            <b-form-input
              placeholder="pronunciation"
              v-model="editPayload.pronunciation"
            />
          </b-form-group>
          <b-button type="submit" class="d-none" />
        </b-form>
      </p>
    </b-modal>
    <learn :lessonId="id" />
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">
        {{ lesson.name }}
        <b-badge variant="success" pill>{{ words.length }}</b-badge>
      </h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <router-link
          class="mr-2 btn btn-success"
          :to="{ name: 'learn', params: { id: id } }"
          >Learn</router-link
        >
        <b-button @click="handleDeleteWord" variant="danger" class="float-right"
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
          <template #cell(Actions)="{item}">
            <b-button
              @click="showEditModal(item)"
              size="sm"
              variant="warning"
              class="mt-1 mr-2 text-white"
              ><b-icon icon="pencil"></b-icon>
            </b-button>
            <b-button
              @click="handleDeleteWord(item)"
              size="sm"
              variant="danger"
              class="mt-1 mr-2 text-white"
              ><b-icon icon="trash"></b-icon>
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
import { formatDate } from "@/utils/date";
export default {
  components: { Learn },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  created() {
    this.loadWords(this.id);
    this.loadLesson(this.id);
  },
  data() {
    return {
      payload: {
        source: "",
        target: "",
        pronunciation: "",
        level: 0,
        last_attempt: null
      },
      editPayload: {},
      fields: [
        { key: "source", sortable: true },
        { key: "target", sortable: true },
        { key: "pronunciation", sortable: true },
        { key: "level", sortable: true },
        { key: "last_attempt", sortable: true, formatter: formatDate },
        { key: "created_at", sortable: true, formatter: formatDate },
        { key: "updated_at", sortable: true, formatter: formatDate },
        "Actions"
      ]
    };
  },
  computed: {
    ...mapGetters("lessons", ["lesson", "words"])
  },
  methods: {
    ...mapActions("lessons", [
      "loadLesson",
      "loadWords",
      "createWord",
      "updateWord",
      "deleteWords"
    ]),
    handleSubmit() {
      this.createWord({ ...this.payload, lesson_id: this.id }).then(() => {
        this.payload = {
          source: "",
          target: "",
          pronunciation: "",
          level: 0,
          last_attempt: null
        };
        this.$refs.source.focus();
      });
    },
    showEditModal(doc) {
      this.$bvModal.show("edit-word-modal");
      this.editPayload = Object.assign({}, doc);
    },
    handleDeleteWord(doc) {
      this.deleteWords(doc);
    },
    handleEditWord() {
      this.updateWord(this.editPayload);
      this.$bvModal.hide("edit-word-modal");
    }
  }
};
</script>
