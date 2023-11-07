<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Texts</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <b-button
          @click="$router.push('create-text')"
          variant="success"
          class="float-right mr-2"
          ><b-icon-plus />
        </b-button>
        <b-button
          @click="deleteTexts(checked)"
          variant="danger"
          class="float-right"
          ><b-icon-trash
        /></b-button>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <b-table :items="texts" :fields="fields">
          <template #head(id)>
            <b-checkbox @change="toggleCheckAll" />
          </template>
          <template #cell(title)="data">
            <router-link :to="{ name: 'text', params: { id: data.item.id } }">{{
              data.value
            }}</router-link>
          </template>
          <template #cell(id)="data">
            <b-checkbox v-model="checked" :value="data.value" />
          </template>
          <template #cell(Actions)="{item}">
            <router-link :to="{ name: 'createText', params: { id: item.id } }">
              <b-button size="sm" variant="warning" class="mt-1 mr-2 text-white"
                ><b-icon icon="pencil" aria-label="Help"></b-icon>
              </b-button>
            </router-link>
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
    this.loadTexts();
  },
  data() {
    return {
      checked: [],
      payload: { title: "" },
      editPayload: { title: "" },
      fields: [
        "id",
        { key: "title", sortable: true },
        { key: "createdAt", sortable: true, formatter: formatDate },
        { key: "updatedAt", sortable: true, formatter: formatDate },
        "Actions"
      ]
    };
  },
  computed: {
    ...mapGetters("texts", ["texts"])
  },
  methods: {
    ...mapActions("texts", ["loadTexts", "deleteTexts"]),
    toggleCheckAll(checked) {
      this.checked =
        this.checked.length < this.texts.length && checked === true
          ? this.texts.map(({ id }) => id)
          : [];
    },

    handleSubmit() {
      this.createText(this.payload).then(() => (this.payload.title = ""));
    }
  }
};
</script>
