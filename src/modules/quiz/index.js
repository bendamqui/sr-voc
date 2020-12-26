import { shuffle, extractChoices } from "@/modules/quiz/utils";
import { DIRECTION, QUESTION_TYPE } from "@/modules/quiz/types";

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
  )(words);
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
