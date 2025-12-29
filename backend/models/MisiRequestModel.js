import { DataTypes, Sequelize } from "sequelize";
import db from "../config/Database.js";
import WargaDesa from "./WargaDesaModel.js";
import Owner from "./OwnerModel.js";

const MisiRequest = db.define(
  "misi_request",
  {
    id_misi_request: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_warga_desa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: WargaDesa,
        key: "id_warga_desa",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    judul_misi: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hadiah_koin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    min_reputasi: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    level_required: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hadiah_xp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    catatan_owner: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_owner: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Owner,
        key: "id_owner",
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

WargaDesa.hasMany(MisiRequest, { foreignKey: "id_warga_desa" });
MisiRequest.belongsTo(WargaDesa, { foreignKey: "id_warga_desa" });

Owner.hasMany(MisiRequest, { foreignKey: "id_owner" });
MisiRequest.belongsTo(Owner, { foreignKey: "id_owner" });

export default MisiRequest;
