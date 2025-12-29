import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Item = db.define(
  "item",
  {
    id_item: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("buff_xp", "buff_koin", "cosmetic"),
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      defaultValue: 1,
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    price_koin: {
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

export default Item;
