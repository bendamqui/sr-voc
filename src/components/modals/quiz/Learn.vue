<template>
  <b-modal hide-footer dialog-class="quiz-modal" id="full-screen-modal">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12">
          <progress-bar :max="progress.max" :results="progress.results" />
        </div>
      </div>
    </div>
    <div class="container h-100">
      <div class="row h-100 justify-content-center align-items-center">
        <div class="col-12">
          <div v-if="finished">
            <div v-if="isLessonCompleted">
              <h3>
                Congratulations! You complete the lesson.
              </h3>
            </div>
            <div v-if="!isLessonCompleted">
              <h3>
                Oups... you had {{ progressObject.success }} good answer out of
                {{ progressObject.total }}. You need a perfect score for the
                lesson to be completed.
              </h3>
              <b-button variant="success" @click="start">Try again</b-button>
            </div>
          </div>
          <qcm
            v-if="isQcm"
            :question="quiz.question"
            :has-error="hasError"
            @click="quiz.validate"
            @next="handleNext"
          />
          <quiz-input
            v-if="isInput"
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
import Qcm from "@/components/modals/quiz/Qcm";
import QuizInput from "@/components/modals/quiz/QuizInput";

import { createObservableQuizWithSteps, createQuiz } from "@/modules/quiz";
import { DIRECTION, QUESTION_TYPE } from "@/modules/quiz/types";
import { Word, Lesson } from "@/sqlite";
import { Words } from "@/pouch";

const saveResult = (question, result) => {
  console.log(question, result);
};

export default {
  components: { ProgressBar, Qcm, QuizInput },
  props: {
    lessonId: {
      required: true,
      type: [String, Number]
    }
  },
  beforeCreate() {
    this.$root.$on("bv::modal::show", (bvEvent, modalId) => {
      if (modalId === "full-screen-modal") {
        this.start();
      }
    });
  },
  computed: {
    progressObject() {
      return this.progress.toObject();
    },
    isLessonCompleted() {
      return this.finished && this.progressObject.danger === 0;
    },
    isQcm() {
      return (
        this.quiz.step && this.quiz.step.questionType === QUESTION_TYPE.QCM
      );
    },
    isInput() {
      return (
        this.quiz.step && this.quiz.step.questionType === QUESTION_TYPE.INPUT
      );
    }
  },
  data() {
    return {
      steps: [
        /*{
          questionType: QUESTION_TYPE.QCM,
          direction: DIRECTION.TARGET_TO_SOURCE,
          validator: (question, input) => question.target === input,
          afterValidation: saveResult
        },
        {
          questionType: QUESTION_TYPE.QCM,
          direction: DIRECTION.SOURCE_TO_TARGET,
          validator: (question, input) => question.target === input,
          afterValidation: saveResult
        },*/
        {
          questionType: QUESTION_TYPE.INPUT,
          direction: DIRECTION.SOURCE_TO_TARGET,
          validator: (question, input) => question.target === input,
          afterValidation: saveResult
        }
      ],
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
    async start() {
      const { docs } = await Words.find({
        selector: { lesson_id: this.lessonId },
        include_docs: true
      });
      this.quiz = createObservableQuizWithSteps(docs, [
        {
          questionType: QUESTION_TYPE.QCM,
          direction: DIRECTION.TARGET_TO_SOURCE,
          validator: (question, input) => question.target === input,
          afterValidation: saveResult
        },
        {
          questionType: QUESTION_TYPE.QCM,
          direction: DIRECTION.SOURCE_TO_TARGET,
          validator: (question, input) => question.target === input,
          afterValidation: saveResult
        },
        {
          questionType: QUESTION_TYPE.INPUT,
          direction: DIRECTION.SOURCE_TO_TARGET,
          validator: (question, input) => question.target === input,
          afterValidation: saveResult
        }
      ]);
      this.quiz.start();
      /*this.words = docs;
      this.finished = false;
      this.steps.reset();
      this.progress.reset();
      this.progress.max = this.words.length * this.steps.length;
      this.quiz = createQuiz(this.words, this.steps.next());
      this.question = this.quiz.next();*/
    },

    nextStep() {
      if (this.quiz.hasErrors()) {
        this.quiz.retryIncorrectAnswers();
        return (this.question = this.quiz.next());
      }
      if (this.steps.hasMore()) {
        this.quiz = createQuiz(this.words, this.steps.next());
        this.question = this.quiz.next();
        return this.question;
      }
      this.finished = true;
      if (this.isLessonCompleted) {
        this.onComplete();
      }
    },

    async onComplete() {
      const lesson = await Lesson.findByPk(this.lessonId);
      if (lesson.completed !== true) {
        Word.update(
          { lastAttempt: new Date(), level: 1 },
          { where: { LessonId: this.lessonId } }
        ).then(() => {
          Lesson.update({ completed: true }, { where: { id: this.lessonId } });
        });
      }
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
          this.nextStep();
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
        this.nextStep();
      }
    }
  }
};
</script>
