import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";

const Petualang = db.define(
    "petualang",
    {
        id_petualang: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        koin: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        jumlah_misi_selesai: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        poin_pengalaman: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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

export default Petualang;
