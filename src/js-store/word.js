import { model } from "@/js-store/model";
import { subHours, subDays } from "date-fns";

export const Word = {
  ...model({ name: "words" }),
  selectDifficult() {
    return this.select({
      aggregate: { count: ["id", "result"] },
      where: { level: { "-": { low: 1, high: 2 } } },
      groupBy: "wordId",
      join: {
        with: "results",
        where: { type: "review" },
        on: "words.id=results.wordId",
        as: { updatedAt: "resultUpdatedAt", createdAt: "resultCreatedAt" }
      }
    }).then(words => {
      return words
        .map(word => {
          const {
            wordId,
            lessonId,
            source,
            target,
            pronunciation,
            level,
            lastAttempt,
            "count(result)": success,
            "count(id)": attempts
          } = word;
          return {
            id: wordId,
            lessonId,
            source,
            target,
            pronunciation,
            level,
            lastAttempt,
            success,
            attempts,
            ratio: Math.round((success / attempts) * 100)
          };
        })
        .filter(({ ratio }) => ratio < 90);
    });
  },
  selectWordsToReview() {
    const query = [
      { level: 1, value: subHours(new Date(), 4) },
      { level: 2, value: subDays(new Date(), 1) },
      { level: 3, value: subDays(new Date(), 3) },
      { level: 4, value: subDays(new Date(), 7) },
      { level: 5, value: subDays(new Date(), 14) },
      { level: 6, value: subDays(new Date(), 30) },
      { level: 7, value: subDays(new Date(), 90) },
      { level: 8, value: subDays(new Date(), 180) }
    ].map(filter => ({
      from: "words",
      where: {
        level: filter.level,
        lastAttempt: { "<": filter.value }
      }
    }));
    return this.connection.union(query);
  }
};
