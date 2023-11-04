<template>
  <div>
    <b-modal @ok="handleEditLesson" id="edit-lesson-modal" title="Edit lesson">
      <p class="my-4">
        <b-form @submit.prevent="handleEditLesson">
          <b-form-input v-model="editPayload.name"></b-form-input>
        </b-form>
      </p>
    </b-modal>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Lessons</h1>
    </div>
    <div class="row mb-3">
      <div class="col-6">
        <form @submit.prevent="handleSubmit" class="form-inline">
          <b-form-input
            type="text"
            v-model="payload.name"
            class="mr-2"
            placeholder="Name"
          />
          <b-button type="submit" variant="success" class="float-right">
            <b-icon-plus-circle />
          </b-button>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <b-table :items="lessons" :fields="fields">
          <template #cell(name)="data">
            <router-link
              :to="{ name: 'lesson', params: { id: data.item._id } }"
              >{{ data.value }}</router-link
            >
          </template>
          <template #cell(Actions)="{item}">
            <b-button
              @click="showEditModal(item)"
              size="sm"
              variant="warning"
              class="mt-1 mr-2 text-white"
              ><b-icon icon="pencil" aria-label="Help"></b-icon>
            </b-button>
            <b-button
              @click="handleDelete(item)"
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
import { formatDate } from "@/utils/date";
import lessons from "../store/modules/lessons";
export default {
  created() {
    this.loadLessons();
  },
  data() {
    return {
      payload: { name: "", completed: false },
      editPayload: { name: "" },
      editDocument: {},
      fields: [
        { key: "name", sortable: true },
        { key: "completed", sortable: true },
        { key: "created_at", sortable: true, formatter: formatDate },
        { key: "updated_at", sortable: true, formatter: formatDate },
        "Actions"
      ]
    };
  },
  computed: {
    lessons() {
      return lessons;
    },
    ...mapGetters("lessons", ["lessons"])
  },
  methods: {
    ...mapActions("lessons", [
      "loadLessons",
      "createLesson",
      "deleteLesson",
      "updateLesson"
    ]),
    handleSubmit() {
      this.createLesson(this.payload).then(() => (this.payload.name = ""));
    },
    handleDelete(doc) {
      this.deleteLesson(doc);
    },
    showEditModal(document) {
      this.editDocument = document;
      this.editPayload.name = document.name;
      this.$bvModal.show("edit-lesson-modal");
    },
    handleEditLesson() {
      this.updateLesson({
        ...this.editDocument,
        ...this.editPayload
      });
      this.$bvModal.hide("edit-lesson-modal");
    }
  }
};
</script>
