import { Lesson, Word, Result } from "@/sqlite";
import { writeFile } from "fs";

export const exportData = async path => {
  const data = {};
  data.lessons = await Lesson.findAll({ raw: true });
  data.words = await Word.findAll({ raw: true });
  data.results = await Result.findAll({ raw: true });
  writeFile(path, JSON.stringify(data), () => console.log("done"));
};
