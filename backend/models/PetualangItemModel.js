import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Petualang from "./PetualangModel.js";
import Item from "./ItemModel.js";

const PetualangItem = db.define(
  "petualang_item",
  {
    id_petualang_item: {
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
    id_item: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Item,
        key: "id_item",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Petualang.hasMany(PetualangItem, { foreignKey: "id_petualang" });
PetualangItem.belongsTo(Petualang, { foreignKey: "id_petualang" });

Item.hasMany(PetualangItem, { foreignKey: "id_item" });
PetualangItem.belongsTo(Item, { foreignKey: "id_item" });

export default PetualangItem;
