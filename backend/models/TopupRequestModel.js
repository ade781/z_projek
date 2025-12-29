import { DataTypes, Sequelize } from "sequelize";
import db from "../config/Database.js";
import WargaDesa from "./WargaDesaModel.js";
import Owner from "./OwnerModel.js";

const TopupRequest = db.define(
  "topup_request",
  {
    id_topup_request: {
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
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
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
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

WargaDesa.hasMany(TopupRequest, { foreignKey: "id_warga_desa" });
TopupRequest.belongsTo(WargaDesa, { foreignKey: "id_warga_desa" });

Owner.hasMany(TopupRequest, { foreignKey: "id_owner" });
TopupRequest.belongsTo(Owner, { foreignKey: "id_owner" });

export default TopupRequest;
