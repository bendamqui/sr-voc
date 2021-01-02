<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">
        Dictionary
      </h1>
    </div>
    <div class="row mb-3">
      <div class="col-12">
        <b-form @submit.prevent="search(payload.search)" class="form-inline">
          <b-form-input
            type="text"
            v-model="payload.search"
            class="mr-2"
            placeholder="Search"
          />
          <b-button type="submit" variant="success" class="float-right">
            <b-icon-search />
          </b-button>
        </b-form>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <b-table :items="words" :fields="fields">
          <template #cell(player)="data">
            <audio controls="">
              <source :src="`data:audio/wav;base64,${data.item.audioBase64}`" />
            </audio>
          </template>
          <template #cell(Actions)="{item}">
            <b-button
              @click="addToLesson(item)"
              size="sm"
              variant="success"
              class="mt-1 mr-2 text-white"
              ><b-icon icon="plus-circle" aria-label="Help"></b-icon>
            </b-button>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  created() {},
  data: () => ({
    fields: ["source", "target", "audioUrl", "player", "Actions"],
    payload: { search: "" }
  }),
  computed: {
    ...mapGetters("dictionary", ["words"])
  },
  methods: {
    ...mapActions("dictionary", ["search"]),
    addToLesson() {
      console.log("to do");
    }
  }
};
</script>
