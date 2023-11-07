<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Review</h1>
    </div>
    <ProgressBar v-if="quiz.started" :stats="quiz.progress" />
    <div v-if="quiz.started && !quiz.done">
      <QuizInputForm :quiz="quiz" />
    </div>
    <div v-if="quiz.done">
      <Results :results="quiz.results" />
      <router-link class="btn btn-success" :to="{ name: 'dashboard' }"
        >Done</router-link
      >
    </div>
  </div>
</template>

<script>
import { DIRECTION, QUESTION_TYPE } from "@/modules/quiz/types";
import { Words } from "@/pouch";
import { createObservableQuizWithSteps } from "@/modules/quiz";
import { mapActions, mapGetters } from "vuex";
import ProgressBar from "@/components/Quizzes/ProgressBar.vue";
import QuizInputForm from "@/components/Quizzes/QuizInputForm.vue";
import Results from "@/pages/CustomQuiz/Components/Results.vue";

export default {
  components: { QuizInputForm, ProgressBar, Results },
  async created() {
    await this.fetch();
    await this.start();
  },
  data() {
    return {
      quiz: {}
    };
  },
  computed: {
    ...mapGetters("settings", ["toPouchReviewQuery"])
  },
  methods: {
    ...mapActions("resultsLog", ["logResult"]),
    ...mapActions("settings", ["fetch"]),
    async start() {
      const { docs } = await Words.find({
        ...this.toPouchReviewQuery
      });
      this.quiz = createObservableQuizWithSteps(
        docs,
        [
          {
            questionType: QUESTION_TYPE.INPUT,
            direction: DIRECTION.SOURCE_TO_TARGET,
            validator: (question, input) => question.target === input
          }
        ],
        {
          retryErrors: true,
          afterValidation: this.saveResult
        }
      );
      this.quiz.start();
    },
    // @todo pass isRetrying argument instead of setting level to 0
    async saveResult(question, result, answer) {
      const word = await Words.get(question._id);
      Words.put({
        ...word,
        level: result ? word.level + 1 : 0,
        last_attempt: Date.now()
      });
      await this.logResult({
        _id: question._id,
        type: "review",
        result,
        answer
      });
    }
  }
};
</script>
