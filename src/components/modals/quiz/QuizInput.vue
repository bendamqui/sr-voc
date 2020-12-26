<template>
  <div>
    <h1>
      {{ question.source }}
      <span v-if="hasError"
        ><b class="text-danger">/ {{ question.target }}</b></span
      >
    </h1>
    <b-form @submit.prevent="$emit('submit', answer)">
      <b-form-input ref="answer" :disabled="hasError" v-model="answer" />
      <b-button type="submit" variant="success" class="mt-2 mr-2"
        >Submit</b-button
      >
      <b-button
        ref="next"
        :disabled="!hasError"
        @click="$emit('next')"
        variant="info"
        class="mt-2"
        >Next</b-button
      >
    </b-form>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    },
    hasError: {
      type: Boolean,
      require: true
    }
  },
  data: () => ({ answer: "" }),
  watch: {
    question() {
      this.answer = "";
      this.$nextTick(() => this.$refs.answer.focus());
    },
    hasError(hasError) {
      if (hasError) {
        this.$nextTick(() => this.$refs.next.focus());
      }
    }
  }
};
</script>
