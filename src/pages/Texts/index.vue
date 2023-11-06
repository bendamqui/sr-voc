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
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <b-table :items="texts" :fields="fields">
          <template #cell(title)="data">
            <router-link
              :to="{ name: 'text', params: { id: data.item._id } }"
              >{{ data.value }}</router-link
            >
          </template>

          <template #cell(Actions)="{item}">
            <router-link :to="{ name: 'createText', params: { id: item._id } }">
              <b-button size="sm" variant="warning" class="mt-1 mr-2 text-white"
                ><b-icon icon="pencil" aria-label="Help"></b-icon>
              </b-button>
            </router-link>
            <b-button
              @click="deleteText(item)"
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
    this.loadTexts();
  },
  data() {
    return {
      fields: [
        { key: "title", sortable: true },
        { key: "created_at", sortable: true, formatter: formatDate },
        { key: "updated_at", sortable: true, formatter: formatDate },
        { key: "Actions" }
      ]
    };
  },
  computed: {
    ...mapGetters("texts", ["texts"])
  },
  methods: {
    ...mapActions("texts", ["loadTexts", "deleteText"])
  }
};
</script>
