import { DataTypes as type, Op } from "sequelize";
import { Result } from "@/sqlite/index";
import { subDays, subHours } from "date-fns";

export const createWord = sequelize => {
  const model = sequelize.define("Word", {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    source: { type: type.STRING },
    target: { type: type.STRING },
    pronunciation: { type: type.STRING },
    level: { type: type.INTEGER, allowNull: false, defaultValue: 0 },
    lastAttempt: { type: type.DATE }
  });

  model.selectWordsToReview = async () => {
    return model.findAll({
      where: {
        [Op.or]: [
          { level: 1, lastAttempt: { [Op.lt]: subHours(new Date(), 4) } },
          { level: 2, lastAttempt: { [Op.lt]: subDays(new Date(), 1) } },
          { level: 3, lastAttempt: { [Op.lt]: subDays(new Date(), 3) } },
          { level: 4, lastAttempt: { [Op.lt]: subDays(new Date(), 7) } },
          { level: 5, lastAttempt: { [Op.lt]: subDays(new Date(), 14) } },
          { level: 6, lastAttempt: { [Op.lt]: subDays(new Date(), 30) } },
          { level: 7, lastAttempt: { [Op.lt]: subDays(new Date(), 90) } },
          { level: 8, lastAttempt: { [Op.lt]: subDays(new Date(), 180) } }
        ]
      },
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
      having: { "`Results.ratio`": { [Op.lt]: 90 } },
      group: "Word.id",
      raw: true
    });
  };
  return model;
};
