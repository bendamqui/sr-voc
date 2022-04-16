import { DataTypes as type } from "sequelize";

export const createHayyimDictionary = sequelize => {
  return sequelize.define("HayyimDictionary", {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    word: { type: type.STRING },
    html: { type: type.TEXT }
  });
};
