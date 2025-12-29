import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Petualang from "./PetualangModel.js";
import Guild from "./GuildModel.js";

const GuildMember = db.define(
  "guild_member",
  {
    id_guild_member: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_guild: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Guild,
        key: "id_guild",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
    role: {
      type: DataTypes.ENUM("leader", "member"),
      defaultValue: "member",
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Guild.hasMany(GuildMember, { foreignKey: "id_guild" });
GuildMember.belongsTo(Guild, { foreignKey: "id_guild" });

Petualang.hasMany(GuildMember, { foreignKey: "id_petualang" });
GuildMember.belongsTo(Petualang, { foreignKey: "id_petualang" });

export default GuildMember;
