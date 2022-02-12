import { Sequelize } from "sequelize";
import { remote } from "electron";
const { app } = remote;
import sqlite3 from "sqlite3";
import { createDictionaryWord } from "@/sqlite/DictionaryWord";
import { createLesson } from "@/sqlite/Lesson";
import { createWord } from "@/sqlite/Word";
import { createResult } from "@/sqlite/Result";
import { createText } from "@/sqlite/Text";
import { createAnnotation } from "@/sqlite/Annotation";

const storage = `${app.getPath("userData")}/${process.env.NODE_ENV}.sqlite`;
console.log(`connection to sqlite with file -> ${storage}`);

const sequelize = new Sequelize("db", null, null, {
  dialectModule: sqlite3,
  dialect: "sqlite",
  storage,
  logging: false
});

const DictionaryWord = createDictionaryWord(sequelize);
const Lesson = createLesson(sequelize);
const Word = createWord(sequelize);
const Result = createResult(sequelize);
const Text = createText(sequelize);
const Annotation = createAnnotation(sequelize);

Lesson.hasMany(Word);
Word.belongsTo(Lesson);
Word.hasMany(Result);
Result.belongsTo(Word);
Text.hasMany(Annotation);
Annotation.belongsTo(Text);

const createSync = (...models) => {
  return () => {
    const promises = models.map(model => {
      return model.sync({ alter: false });
    });
    return Promise.all(promises);
  };
};

const sync = createSync(Lesson, Word, Result, Text, Annotation);

export {
  sequelize,
  sync,
  DictionaryWord,
  Lesson,
  Word,
  Result,
  Text,
  Annotation
};
