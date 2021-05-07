<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Create Text</h1>
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
            <quill-editor :auto-height="false" v-model="payload.content" />
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <b-button @click="$router.push('texts')" class="mr-2" variant="danger"
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

export default {
  props: {
    id: {
      type: Number,
      required: false
    }
  },
  created() {
    if (this.isUpdate) {
      this.payload = this.text(this.id).dataValues;
    }
  },
  data: () => ({
    payload: {
      title: "",
      content: ""
    }
  }),
  computed: {
    ...mapGetters("texts", ["text"]),
    isUpdate() {
      return this.id !== undefined;
    }
  },
  methods: {
    ...mapActions("texts", ["createText", "updateText"]),
    handleSubmit() {
      if (this.isUpdate) {
        this.updateText(this.payload).then(() => this.$router.push("texts"));
      } else {
        this.createText(this.payload).then(() => this.$router.push("texts"));
      }
    }
  }
};
</script>
