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
      <div class="btn-toolbar mb-2 mb-md-0">
        <b-button
          @click="deleteLessons(checked)"
          variant="danger"
          class="float-right"
          ><b-icon-trash
        /></b-button>
      </div>
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
          <template #head(id)>
            <b-checkbox @change="toggleCheckAll" />
          </template>
          <template #cell(name)="data">
            <router-link
              :to="{ name: 'lesson', params: { id: data.item.id } }"
              >{{ data.value }}</router-link
            >
          </template>
          <template #cell(id)="data">
            <b-checkbox v-model="checked" :value="data.value" />
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
import { formatDate } from "@/utils/date";
export default {
  created() {
    this.loadLessons();
  },
  data() {
    return {
      checked: [],
      payload: { name: "" },
      editPayload: { name: "" },
      fields: [
        "id",
        { key: "name", sortable: true },
        { key: "completed", sortable: true },
        { key: "createdAt", sortable: true, formatter: formatDate },
        { key: "updatedAt", sortable: true, formatter: formatDate },
        "Actions"
      ]
    };
  },
  computed: {
    ...mapGetters("lessons", ["lessons"])
  },
  methods: {
    ...mapActions("lessons", [
      "loadLessons",
      "createLesson",
      "deleteLessons",
      "updateLesson"
    ]),
    toggleCheckAll(checked) {
      this.checked =
        this.checked.length < this.lessons.length && checked === true
          ? this.lessons.map(({ id }) => id)
          : [];
    },

    handleSubmit() {
      this.createLesson(this.payload).then(() => (this.payload.name = ""));
    },
    showEditModal(item) {
      this.$bvModal.show("edit-lesson-modal");
      const { id, name } = item;
      this.editPayload = { id, name };
    },
    handleEditLesson() {
      this.updateLesson(this.editPayload);
      this.$bvModal.hide("edit-lesson-modal");
    }
  }
};
</script>
