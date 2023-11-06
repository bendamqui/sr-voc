<template>
  <div>
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Learn word from: {{ lesson.name }}</h1>
    </div>
    <ProgressBar v-if="quiz.started" :stats="quiz.progress" />
    <div v-if="quiz.started && !quiz.done">
      <QuizInputForm v-if="showInputForm" :quiz="quiz" />
      <Qcm v-if="showQcmForm" :quiz="quiz">qcm</Qcm>
    </div>
    <div v-if="quiz.done">
      <Results :results="quiz.results" />
      <router-link
        class="btn btn-success"
        :to="{ name: 'lesson', params: { id } }"
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
import Qcm from "@/components/Quizzes/Qcm.vue";

export default {
  props: {
    id: {
      required: true
    }
  },
  components: { Qcm, QuizInputForm, ProgressBar, Results },
  created() {
    this.loadResults();
    this.loadLesson(this.id);
    this.start();
  },
  data() {
    return {
      quiz: {}
    };
  },
  computed: {
    lesson() {
      return this.lesson;
    },
    ...mapGetters("lessons", ["lesson"]),
    ...mapGetters("resultsLog", ["results"]),
    showInputForm() {
      return (
        this.quiz.started && this.quiz.step.questionType === QUESTION_TYPE.INPUT
      );
    },
    showQcmForm() {
      return (
        this.quiz.started && this.quiz.step.questionType === QUESTION_TYPE.QCM
      );
    }
  },
  methods: {
    ...mapActions("lessons", ["loadLesson", "updateLesson"]),
    ...mapActions("resultsLog", ["createResult", "logResult", "loadResults"]),
    async start() {
      const { docs } = await Words.find({
        selector: { lesson_id: this.id },
        include_docs: true
      });
      this.quiz = createObservableQuizWithSteps(
        docs,
        [
          {
            questionType: QUESTION_TYPE.QCM,
            direction: DIRECTION.TARGET_TO_SOURCE,
            validator: (question, input) => question.target === input
          },
          {
            questionType: QUESTION_TYPE.QCM,
            direction: DIRECTION.SOURCE_TO_TARGET,
            validator: (question, input) => question.target === input
          },
          {
            questionType: QUESTION_TYPE.INPUT,
            direction: DIRECTION.SOURCE_TO_TARGET,
            validator: (question, input) => question.target === input
          }
        ],
        {
          retryErrors: true,
          afterValidation: this.saveResult,
          onComplete: this.onComplete(docs)
        }
      );
      this.quiz.start();
    },
    onComplete(docs) {
      return async () => {
        if (!this.quiz.hasErrors()) {
          console.log("yo");
          this.updateLesson({
            ...this.lesson,
            completed: true
          });
          Words.bulkDocs(
            docs.map(doc => ({
              ...doc,
              last_attempt: Date.now(),
              level: doc.level === 0 ? 1 : doc.level
            }))
          );
        }
      };
    },
    saveResult(question, result, answer) {
      this.logResult({
        _id: question._id,
        type: "learn",
        result,
        answer
      });
    }
  }
};
</script>
