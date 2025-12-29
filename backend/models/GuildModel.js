import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Petualang from "./PetualangModel.js";

const Guild = db.define(
  "guild",
  {
    id_guild: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    motto: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    leader_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Petualang,
        key: "id_petualang",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
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

Petualang.hasMany(Guild, { foreignKey: "leader_id" });
Guild.belongsTo(Petualang, { foreignKey: "leader_id", as: "leader" });

export default Guild;
