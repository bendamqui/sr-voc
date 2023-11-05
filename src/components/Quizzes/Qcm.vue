<template>
  <div>
    <h1>{{ quiz.question.source }}</h1>
    <b-list-group>
      <b-list-group-item
        v-for="(choice, index) in quiz.question.choices"
        :key="index"
        @click="handleClick(choice)"
        >{{ `${index + 1}. ${choice.target}` }}</b-list-group-item
      >
    </b-list-group>
    <div v-if="quiz.paused" class="mt-2">
      <b class="text-danger">{{ quiz.question.target }}</b>
      <b-button @click="quiz.next()" class="float-right">Next</b-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    quiz: {
      required: true
    }
  },
  methods: {
    handleClick({ target }) {
      if (!this.quiz.paused) {
        this.quiz.answer = target;
        this.quiz.validate();
      }
    }
  }
};
</script>
