<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Annotated Texts</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <b-button
          @click="$router.push('create-annotated-text')"
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
          <template #cell(title)="data">
            <router-link
              :to="{ name: 'annotated-text', params: { id: data.item._id } }"
              >{{ data.value }}</router-link
            >
          </template>
          <template #cell(_id)="data">
            <b-checkbox v-model="checked" :value="data.item" />
          </template>
          <template #cell(Actions)="{item}">
            <router-link
              :to="{ name: 'create-annotated-text', params: { id: item._id } }"
            >
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

export default {
  data() {
    return {
      checked: [],
      fields: [
        "_id",
        { key: "title", sortable: true },
        { key: "created_at", sortable: true },
        { key: "updated_at", sortable: true },
        "Actions"
      ]
    };
  },
  created() {
    this.fetchTexts();
  },
  computed: {
    ...mapGetters("annotatedTexts", ["texts"])
  },
  methods: {
    ...mapActions("annotatedTexts", ["fetchTexts", "deleteTexts"])
  }
};
</script>
