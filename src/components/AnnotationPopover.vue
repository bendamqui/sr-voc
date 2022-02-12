<template>
  <div class="row" v-if="show" style="border: solid">
    <div class="col-md-12">
      {{ annotation.content }}
    </div>
    <div class="col-md-12">
      <b-button @click="$emit('close')" class="mr-3" size="sm" variant="warning"
        >Close</b-button
      >
      <b-button @click="handleDelete" size="sm" variant="danger"
        >Delete</b-button
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    show: {},
    id: {}
  },
  computed: {
    ...mapGetters("annotations", ["annotation"])
  },
  methods: {
    ...mapActions("annotations", ["fetchAnnotation", "deleteAnnotation"]),
    handleDelete() {
      this.deleteAnnotation(this.id);
    }
  },
  watch: {
    id: function(newValue) {
      this.fetchAnnotation(newValue);
    }
  }
};
</script>
