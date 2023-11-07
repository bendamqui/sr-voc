<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h1>{{ quiz.question.source }}</h1>
      </div>
    </div>
    <b-form @submit.prevent="quiz.validate()">
      <div class="row">
        <div class="col-md-6">
          <b-form-group>
            <b-form-input
              ref="answer"
              v-model="quiz.answer"
              :disabled="quiz.paused"
            />
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6" v-if="quiz.paused">
          <h3 class="text-danger font-weight-bold">
            {{ quiz.question.target }} {{ quiz.question.pronunciation }}
          </h3>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <b-button ref="next" :disabled="!quiz.paused" @click="handleNext"
            >Next</b-button
          >
        </div>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  props: {
    quiz: {
      required: true
    }
  },
  computed: {
    paused() {
      return this.quiz.paused;
    }
  },
  methods: {
    handleNext() {
      this.quiz.next();
    }
  },
  watch: {
    paused(value) {
      value
        ? this.$nextTick(() => this.$refs.next.focus())
        : this.$nextTick(() => this.$refs.answer.focus());
    }
  }
};
</script>
