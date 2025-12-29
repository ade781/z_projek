import { DataTypes, Sequelize } from "sequelize";
import db from "../config/Database.js";
import MarketListing from "./MarketListingModel.js";

const MarketTransaction = db.define(
  "market_transaction",
  {
    id_transaction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_listing: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MarketListing,
        key: "id_listing",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    seller_role: {
      type: DataTypes.ENUM("petualang", "warga"),
      allowNull: false,
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    buyer_role: {
      type: DataTypes.ENUM("petualang", "warga"),
      allowNull: false,
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tax_amount: {
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

MarketListing.hasMany(MarketTransaction, { foreignKey: "id_listing" });
MarketTransaction.belongsTo(MarketListing, { foreignKey: "id_listing" });

export default MarketTransaction;
