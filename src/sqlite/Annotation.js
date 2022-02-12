import { DataTypes as type } from "sequelize";

export const createAnnotation = sequelize => {
  return sequelize.define("Annotation", {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    selector: { type: type.STRING },
    content: { type: type.TEXT }
  });
};
