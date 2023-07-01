<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Create Annotated Text</h1>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-md-6">
          <b-form-group label="Title">
            <b-form-input v-model="payload.title" />
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <b-form-group label="Content">
            <b-textarea dir="rtl" rows="20" v-model="payload.content" />
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <b-button
            @click="$router.push('annotated-texts')"
            class="mr-2"
            variant="danger"
            >Cancel</b-button
          >
          <b-button type="submit" variant="success">Submit</b-button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { payloadToText } from "@/utils/annotatedText";

export default {
  props: {
    id: {
      type: String,
      required: false
    }
  },
  async created() {
    if (this.isUpdate) {
      await this.fetchText(this.id);
      this.payload = {
        ...this.text,
        content: payloadToText(this.text.content)
      };
    }
  },
  data: () => ({
    payload: {
      title: "",
      content: ""
    }
  }),
  computed: {
    ...mapGetters("annotatedTexts", ["text"]),
    isUpdate() {
      return this.id !== undefined;
    }
  },
  methods: {
    ...mapActions("annotatedTexts", ["createText", "updateText", "fetchText"]),
    handleSubmit() {
      if (this.isUpdate) {
        this.updateText(this.payload).then(() =>
          this.$router.push("annotated-texts")
        );
      } else {
        this.createText(this.payload).then(() =>
          this.$router.push("annotated-texts")
        );
      }
    }
  }
};
</script>
