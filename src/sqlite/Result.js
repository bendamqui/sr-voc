import { DataTypes as type } from "sequelize";

export const createResult = sequelize => {
  return sequelize.define("Result", {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    result: { type: type.INTEGER },
    type: { type: type.ENUM("learn", "review", "overStudy") }
  });
};
