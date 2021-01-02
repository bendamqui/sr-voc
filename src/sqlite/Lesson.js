import { DataTypes as type } from "sequelize";

export const createLesson = sequelize => {
  return sequelize.define("Lesson", {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: type.STRING },
    completed: { type: type.BOOLEAN }
  });
};
