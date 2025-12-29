import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const QuestTemplate = db.define(
  "quest_template",
  {
    id_quest_template: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("daily", "weekly"),
      allowNull: false,
    },
    objective_type: {
      type: DataTypes.ENUM("complete_misi", "earn_koin", "earn_xp"),
      allowNull: false,
    },
    target_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reward_koin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reward_xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default QuestTemplate;
