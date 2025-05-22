import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";

const Misi = db.define(
  "misi",
  {
    id_misi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    judul_misi: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hadiah_koin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    hadiah_xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    level_required: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    status_misi: {
      type: DataTypes.ENUM("belum diambil", "aktif", "selesai"),
      defaultValue: "belum diambil",
    },

    id_pembuat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "owner",
        key: "id_owner",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    id_petualang: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "petualang",
        key: "id_petualang",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },

  {
    freezeTableName: true,
    timestamps: false,
  }
);




export default Misi;
