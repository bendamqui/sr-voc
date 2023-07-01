<template>
  <span>
    <br v-if="isLineBreak" />
    <span v-else v-b-popover.click="popover">{{ word.value }} </span>
  </span>
</template>

<script>
export default {
  props: {
    word: {
      type: Object,
      require: true
    }
  },

  computed: {
    isLineBreak() {
      return this.word.type === "LineBreak";
    },
    popover() {
      return {
        title: `<strong>${this.word.word}</strong>`,
        content: () => {
          return `<p><strong>Definition: </strong>${this.word.definition}</p>`;
        },
        html: true
      };
    }
  }
};
</script>
