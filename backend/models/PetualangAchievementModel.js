import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Petualang from "./PetualangModel.js";
import Achievement from "./AchievementModel.js";

const PetualangAchievement = db.define(
  "petualang_achievement",
  {
    id_petualang_achievement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_petualang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Petualang,
        key: "id_petualang",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    id_achievement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Achievement,
        key: "id_achievement",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Petualang.hasMany(PetualangAchievement, { foreignKey: "id_petualang" });
PetualangAchievement.belongsTo(Petualang, { foreignKey: "id_petualang" });

Achievement.hasMany(PetualangAchievement, { foreignKey: "id_achievement" });
PetualangAchievement.belongsTo(Achievement, { foreignKey: "id_achievement" });

export default PetualangAchievement;
