import fs from "fs";
import { Lesson } from "@/js-store/lesson";
import { Word } from "@/js-store/word";
import { Result } from "@/js-store/result";
import { Schema } from "@/js-store/schema";

export const importData = async ([file]) => {
  const { words, lessons, results } = JSON.parse(fs.readFileSync(file));
  const resources = [
    {
      table: "lessons",
      data: lessons,
      model: Lesson,
      dateColumns: ["createdAt", "updatedAt"]
    },
    {
      table: "words",
      data: words,
      model: Word,
      dateColumns: ["createdAt", "updatedAt", "lastAttempt"]
    },
    {
      table: "results",
      data: results,
      model: Result,
      dateColumns: ["createdAt", "updatedAt"]
    }
  ];

  resources.forEach(({ table, model, dateColumns, data }) => {
    Schema.getTable(table).timestamps = false;
    model.remove().then(() => {
      model
        .insert(
          data.map(stringToDate(["updatedAt", "createdAt", ...dateColumns]))
        )
        .finally(() => (Schema.getTable(table).timestamps = true));
    });
  });
};

const stringToDate = columns => {
  return item => {
    columns.forEach(column => {
      if (item[column] !== null) {
        item[column] = new Date(item[column]);
      }
    });
    return item;
  };
};
