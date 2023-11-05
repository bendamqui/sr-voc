import { shuffle, extractChoices } from "@/modules/quiz/utils";
import { DIRECTION, QUESTION_TYPE } from "@/modules/quiz/types";
import { arrayIterator } from "@/utils/iterators";

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const createProgress = max => {
  let progress = { success: 0, danger: 0, max };
  return {
    get: () => progress,
    reset: () => (progress = { success: 0, danger: 0 }),
    addSuccess: () => progress.success++,
    addDanger: () => progress.danger++
  };
};

const applyDirection = ({ direction }) => {
  return words => {
    if (direction === DIRECTION.TARGET_TO_SOURCE) {
      return words.map(({ source, target, ...word }) => ({
        ...word,
        target: source,
        source: target
      }));
    }
    return words;
  };
};

const applyQuestionType = ({ questionType, choiceCount }) => {
  return words => {
    if (questionType === QUESTION_TYPE.QCM) {
      return words.map((word, index) => ({
        ...word,
        choices: extractChoices(words, index, choiceCount || 4)
      }));
    }
    return words;
  };
};

const createQuestions = (words, options) => {
  return pipe(
    applyDirection(options),
    applyQuestionType(options),
    shuffle
  )([...words]);
};

export const createQuiz = (words, options) => {
  let question;
  let cursor = 0;
  let errors = [];

  let questions = createQuestions(words, options);
  const progress = createProgress(questions.length);
  let validator = options.validator || (() => {});
  const afterValidation = options.afterValidation || (() => {});

  return {
    next: () => (question = questions[cursor++]),
    hasMoreQuestions: () => cursor < questions.length,
    validate: input => {
      const success = validator(question, input);
      success ? progress.addSuccess() : progress.addDanger();
      if (!success) {
        errors.push(question);
      }
      afterValidation(question, success);
      return success;
    },
    hasErrors: () => errors.length > 0,
    retryIncorrectAnswers: () => {
      questions = shuffle(errors);
      cursor = 0;
      errors = [];
    },
    getProgress: () => progress.get()
  };
};

export const createObservableQuizWithSteps = (words, steps, options) => {
  return Object.assign(
    {
      get progress() {
        return {
          max:
            words.length * this.steps.length +
            (options.retryErrors ? this.errors.length : 0),
          results: this.results.map(({ result }) => result)
        };
      },
      get validator() {
        return (
          this["step"].validator ||
          function(question, input) {
            return question.target === input;
          }
        );
      }
    },
    {
      started: false,
      done: false,
      paused: false,
      cursor: 0,
      answer: "",
      steps: arrayIterator(steps),
      step: {},
      questions: [],
      question: {},
      errors: [],
      results: [],
      start() {
        this.started = true;
        this.step = this.steps.next();
        this.questions = createQuestions(words, this.step);
        this.next();
      },
      next() {
        this.paused = false;
        this.answer = "";
        this.setNextQuestion();
      },
      setNextQuestion() {
        if (this.hasMoreQuestions()) {
          return (this.question = this.questions[this.cursor++]);
        }
        if (this.steps.hasMore()) {
          this.step = this.steps.next();
          this.questions = createQuestions(words, this.step);
          this.cursor = 0;
          return (this.question = this.questions[this.cursor++]);
        }
        if (options.onComplete) {
          options.onComplete();
        }
        this.done = true;
      },
      validate() {
        const result = this.validator(this.question, this.answer);
        this.results.push({
          ...this.question,
          result
        });
        options.afterValidation(this.question, result);
        result ? this.handleSuccess() : this.handleFailure();
      },
      handleFailure() {
        this.paused = true;
        this.errors.push(this.question);
        if (options.retryErrors) {
          this.questions.push(this.question);
        }
      },
      handleSuccess() {
        this.next();
      },
      hasMoreQuestions() {
        return this.cursor < this.questions.length;
      },
      hasErrors() {
        return this.errors.length > 0;
      }
    }
  );
};

export const createObservableQuiz = (words, options) => {
  return Object.assign(
    {
      get progress() {
        return {
          max: this["questions"].length,
          results: this.results.map(({ result }) => result)
        };
      }
    },
    {
      started: false,
      done: false,
      paused: false,
      cursor: 0,
      answer: "",
      questions: createQuestions(words, options),
      question: {},
      errors: [],
      results: [],
      start() {
        this.started = true;
        this.next();
      },
      next() {
        this.paused = false;
        this.answer = "";
        this.hasMoreQuestions()
          ? (this.question = this.questions[this.cursor++])
          : (this.done = true);
      },
      validator:
        options.validator ||
        function(question, input) {
          return question.target === input;
        },
      validate() {
        const result = this.validator(this.question, this.answer);
        this.results.push({
          ...this.question,
          result
        });
        result ? this.handleSuccess() : this.handleFailure();
      },
      handleFailure() {
        this.paused = true;
        this.errors.push(this.question);
        if (options.retryErrors) {
          this.questions.push(this.question);
        }
      },
      handleSuccess() {
        this.next();
      },
      hasMoreQuestions() {
        return this.cursor < this.questions.length;
      }
    }
  );
};
