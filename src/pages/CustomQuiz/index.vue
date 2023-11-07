<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Custom Quiz</h1>
    </div>
    <Settings @start="start" v-if="!quiz.started" />
    <ProgressBar v-if="quiz.started" :stats="quiz.progress" />
    <div v-if="quiz.started && !quiz.done">
      <QuizInputForm :quiz="quiz" />
    </div>
    <div v-if="quiz.done">
      <Results :results="quiz.results" />
      <b-button @click="quiz = {}">Done</b-button>
    </div>
  </div>
</template>

<script>
import { DIRECTION, QUESTION_TYPE } from "@/modules/quiz/types";
import { createObservableQuizWithSteps } from "@/modules/quiz";
import { Words } from "@/pouch";
import QuizInputForm from "@/components/modals/quiz/QuizInputForm";
import Settings from "@/pages/CustomQuiz/Components/Settings";
import ProgressBar from "@/pages/CustomQuiz/Components/ProgressBar";
import Results from "@/pages/CustomQuiz/Components/Results";
import { mapActions } from "vuex";

export default {
  components: { QuizInputForm, Settings, ProgressBar, Results },
  data() {
    return {
      quiz: {},
      qcm: QUESTION_TYPE.QCM,
      sourceToTarget: DIRECTION.SOURCE_TO_TARGET,
      targetToSource: DIRECTION.TARGET_TO_SOURCE,
      settings: {
        questionCount: 2,
        direction: DIRECTION.SOURCE_TO_TARGET
      }
    };
  },
  methods: {
    ...mapActions("resultsLog", ["logResult"]),
    async start(settings) {
      const { docs: words } = await Words.find({
        selector: {
          level: { $in: [1, 2, 3] }
        },
        limit: parseInt(settings.questionCount)
      });

      this.quiz = createObservableQuizWithSteps(
        words,
        [
          {
            questionType: QUESTION_TYPE.INPUT,
            direction: settings.direction
          }
        ],
        {
          afterValidation: this.saveResult,
          retryErrors: settings.retryErrors
        }
      );
      this.quiz.start();
    },
    async saveResult(question, result, answer) {
      await this.logResult({
        _id: question._id,
        type: "custom",
        result,
        answer
      });
    }
  }
};
</script>
