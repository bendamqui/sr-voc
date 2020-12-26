<template>
  <b-modal hide-footer dialog-class="quiz-modal" :id="modalId">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12">
          <progress-bar :max="progress.max" :results="progress.results" />
        </div>
      </div>
    </div>
    <div class="container h-100">
      <div class="row h-100 justify-content-center align-items-center">
        <div v-if="nothingToReview"><h3>Nothing to review</h3></div>
        <div v-if="finished" class="col-12">
          Done
        </div>
        <div class="col-12">
          <quiz-input
            v-if="!finished && !nothingToReview"
            :question="question"
            :has-error="hasError"
            @submit="handleSubmit"
            @next="handleNext"
          />
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import ProgressBar from "@/components/ProgressBar";
import QuizInput from "@/components/modals/quiz/QuizInput";
import { createQuiz } from "@/modules/quiz";
import { DIRECTION, QUESTION_TYPE } from "@/modules/quiz/types";
import { Word } from "@/js-store/word";
import { Result } from "@/js-store/result";
import { mapActions } from "vuex";

export default {
  components: { ProgressBar, QuizInput },
  beforeCreate() {
    this.$root.$on("bv::modal::show", async (bvEvent, modalId) => {
      if (modalId === this.modalId) {
        this.words = await Word.selectWordsToReview();
        if (this.words.length > 0) {
          this.start();
        } else {
          this.nothingToReview = true;
        }
      }
    });
  },
  computed: {
    progressObject() {
      return this.progress.toObject();
    }
  },
  data() {
    return {
      modalId: "review-words-modal",
      nothingToReview: false,
      words: [],
      success: false,
      progress: {
        results: [],
        max: 0,
        toObject() {
          return this.results.reduce(
            (results, value) => {
              value === 0 ? results.danger++ : results.success++;
              results.total++;
              return results;
            },
            {
              success: 0,
              danger: 0,
              total: 0
            }
          );
        },
        reset() {
          this.results = [];
          this.max = 0;
        }
      },
      finished: false,
      quiz: {},
      question: {},
      hasError: false
    };
  },
  methods: {
    ...mapActions("words", ["loadWordsToReviewCount"]),
    start() {
      this.finished = false;
      this.progress.reset();
      this.progress.max = this.words.length;
      this.quiz = createQuiz(this.words, {
        questionType: QUESTION_TYPE.INPUT,
        direction: DIRECTION.SOURCE_TO_TARGET,
        validator: (question, input) => question.target === input,
        afterValidation: this.saveResult
      });
      this.question = this.quiz.next();
    },

    handleSubmit(answer) {
      if (this.hasError) {
        return;
      }
      if (this.quiz.validate(answer)) {
        this.progress.results.push(1);
        if (this.quiz.hasMoreQuestions()) {
          this.question = this.quiz.next();
        } else {
          this.finished = true;
          this.loadWordsToReviewCount();
        }
      } else {
        this.progress.results.push(0);
        this.hasError = true;
      }
    },

    handleNext() {
      this.hasError = false;
      if (this.quiz.hasMoreQuestions()) {
        this.question = this.quiz.next();
      } else {
        this.finished = true;
      }
    },
    saveResult(question, success) {
      Result.insert({
        wordId: question.id,
        type: "review",
        result: success === true ? 1 : 0
      });
      Word.update(
        { lastAttempt: new Date(), level: success ? question.level + 1 : 1 },
        { where: { id: question.id } }
      );
    }
  }
};
</script>
