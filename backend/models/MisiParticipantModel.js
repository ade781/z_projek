import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Misi from "./MisiModel.js";
import Petualang from "./PetualangModel.js";

const MisiParticipant = db.define(
  "misi_participant",
  {
    id_misi_participant: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_misi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Misi,
        key: "id_misi",
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
    status: {
      type: DataTypes.ENUM("aktif", "selesai"),
      defaultValue: "aktif",
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

Misi.hasMany(MisiParticipant, { foreignKey: "id_misi" });
MisiParticipant.belongsTo(Misi, { foreignKey: "id_misi" });

Petualang.hasMany(MisiParticipant, { foreignKey: "id_petualang" });
MisiParticipant.belongsTo(Petualang, { foreignKey: "id_petualang" });

export default MisiParticipant;
