import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Petualang from "./PetualangModel.js";

const Notification = db.define(
  "notification",
  {
    id_notification: {
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
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("approval", "achievement", "quest", "system"),
      defaultValue: "system",
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Petualang.hasMany(Notification, { foreignKey: "id_petualang" });
Notification.belongsTo(Petualang, { foreignKey: "id_petualang" });

export default Notification;
