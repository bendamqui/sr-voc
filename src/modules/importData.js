import fs from "fs";
import { Lesson } from "@/sqlite";
import { Word } from "@/sqlite";
import { Result } from "@/sqlite";

export const importData = async ([file]) => {
  await Result.destroy({ where: {} });
  await Word.destroy({ where: {} });
  await Lesson.destroy({ where: {} });

  const { lessons, words, results } = JSON.parse(
    fs.readFileSync(file, "utf-8")
  );
  await Lesson.bulkCreate(lessons);
  await Word.bulkCreate(
    words.map(word => {
      return {
        ...word,
        LessonId: word.lessonId
      };
    })
  );
  await Result.bulkCreate(
    results.map(result => {
      return {
        ...result,
        WordId: result.wordId
      };
    })
  );
  console.log("handle import");
};
