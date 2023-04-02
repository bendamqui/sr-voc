import { DataTypes as type, Op } from "sequelize";
import { Result } from "@/sqlite/index";

export const createWord = sequelize => {
  const model = sequelize.define("Word", {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    source: { type: type.STRING },
    target: { type: type.STRING },
    pronunciation: { type: type.STRING },
    level: { type: type.INTEGER, allowNull: false, defaultValue: 0 },
    lastAttempt: { type: type.DATE }
  });

  model.selectWordsToReview = async settings => {
    return model.findAll({
      where: {
        [Op.or]: settings
      },
      raw: true
    });
  };

  model.wordsByLevel = () => {
    return model.findAll({
      attributes: [[sequelize.literal("count(*)"), "count"], "level"],
      group: "level",
      order: [["level", "asc"]],
      raw: true
    });
  };

  model.selectDifficult = () => {
    return model.findAll({
      include: {
        attributes: [
          [sequelize.literal("count(*)"), "attempts"],
          [sequelize.literal("sum(result)"), "success"],
          [
            sequelize.literal("round((sum(result) * 1.00)/(count(*)) * 100)"),
            "ratio"
          ]
        ],
        model: Result
      },
      where: { level: { [Op.in]: [1, 2] } },
      having: { "`Results.ratio`": { [Op.lt]: 80 } },
      group: "Word.id",
      raw: true
    });
  };
  return model;
};
