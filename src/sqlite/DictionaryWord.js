import { DataTypes as type } from "sequelize";

export const createDictionaryWord = sequelize => {
  return sequelize.define("DictionaryWord", {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    source: { type: type.STRING },
    target: { type: type.STRING },
    audioUrl: { type: type.STRING },
    audioBase64: { type: type.TEXT }
  });
};
