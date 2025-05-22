import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";
import Petualang from "./PetualangModel.js";
import Misi from "./MisiModel.js";

const LogActivity = db.define(
    "log_aktivitas",
    {
        id_log: {
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
        id_misi: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Misi,
                key: "id_misi",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
        aktivitas: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        tanggal_waktu: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        keterangan: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

// Relasi
Petualang.hasMany(LogActivity, { foreignKey: "id_petualang" });
LogActivity.belongsTo(Petualang, { foreignKey: "id_petualang" });

Misi.hasMany(LogActivity, { foreignKey: "id_misi" });
LogActivity.belongsTo(Misi, { foreignKey: "id_misi" });

export default LogActivity;
