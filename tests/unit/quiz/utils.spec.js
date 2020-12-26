import { shuffle, extractChoices } from "@/modules/quiz/utils";

const incrementalArray = n =>
  Array(n)
    .fill(0)
    .map((_, index) => index);

describe("Test quiz utils", () => {
  describe("Stress test extractChoices", () => {
    incrementalArray(500).forEach(() => {
      const choiceCount = 4;
      const poolSize = 15;
      const pool = incrementalArray(poolSize);
      const questions = pool.map(index => ({
        answer: index,
        choices: extractChoices(pool, index, choiceCount)
      }));

      it("should have all answers", () => {
        expect(
          new Set(questions.map(question => question.answer)).size
        ).toEqual(poolSize);
      });
      it("should include the answer", function() {
        questions.map(question => {
          expect(question.choices.includes(question.answer)).toBe(true);
        });
      });

      it("should be unique", () => {
        questions.map(question => {
          expect(new Set(question.choices).size).toEqual(choiceCount);
        });
      });
    });
  });

  describe("Test shuffle", () => {
    it("should return the same items", () => {
      expect(shuffle([0, 1, 2, 3]).sort()).toEqual([0, 1, 2, 3]);
    });
  });
});
