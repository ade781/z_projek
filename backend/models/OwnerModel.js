import { DataTypes } from "sequelize";
import sequelize from "../config/Database.js"; // sesuaikan path db config-mu
import Misi from "./MisiModel.js";

const Owner = sequelize.define(
  "owner",
  {
    id_owner: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_owner: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    total_koin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  },
  {
    tableName: "owner",
    timestamps: true, // kalau pakai createdAt dan updatedAt, jangan ada field manual
    underscored: false,
  }
);



// Relasi 1 Owner punya banyak Misi
Owner.hasMany(Misi, {
    foreignKey: "id_pembuat",
    as: "misis",
    onDelete: "CASCADE",
});
Misi.belongsTo(Owner, {
    foreignKey: "id_pembuat",
    as: "owner",
});

export default Owner;
