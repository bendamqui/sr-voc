import { Lesson } from "@/js-store/lesson";
import { Word } from "@/js-store/word";
import { Result } from "@/js-store/result";
import { writeFile } from "fs";

export const exportData = async path => {
  const data = {};
  data.lessons = await Lesson.select();
  data.words = await Word.select();
  data.results = await Result.select();
  writeFile(path, JSON.stringify(data), res => {
    console.log(res);
  });
};
