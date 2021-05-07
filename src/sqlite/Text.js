import { DataTypes as type } from "sequelize";

export const createText = sequelize => {
  return sequelize.define("Text", {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: type.STRING },
    content: { type: type.TEXT }
  });
};
