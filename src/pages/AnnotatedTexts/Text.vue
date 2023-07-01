<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">{{ text.title }}</h1>
    </div>
    <div class="row">
      <div class="col-md-12 font-size-lg">
        <Word
          :key="index"
          v-for="(word, index) in text.content"
          :word="word"
        ></Word>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Word from "@/pages/AnnotatedTexts/Word.vue";

export default {
  components: { Word },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      words: []
    };
  },
  created() {
    this.fetchText(this.id);
  },
  computed: {
    ...mapGetters("annotatedTexts", ["text"])
  },
  methods: {
    ...mapActions("annotatedTexts", ["fetchText"])
  }
};
</script>
