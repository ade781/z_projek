import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Achievement = db.define(
  "achievement",
  {
    id_achievement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    target: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    reward_koin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reward_xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Achievement;
