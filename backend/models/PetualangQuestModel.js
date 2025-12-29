import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Petualang from "./PetualangModel.js";
import QuestTemplate from "./QuestTemplateModel.js";

const PetualangQuest = db.define(
  "petualang_quest",
  {
    id_petualang_quest: {
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
    id_quest_template: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: QuestTemplate,
        key: "id_quest_template",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("ongoing", "completed", "claimed"),
      defaultValue: "ongoing",
    },
    period_key: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Petualang.hasMany(PetualangQuest, { foreignKey: "id_petualang" });
PetualangQuest.belongsTo(Petualang, { foreignKey: "id_petualang" });

QuestTemplate.hasMany(PetualangQuest, { foreignKey: "id_quest_template" });
PetualangQuest.belongsTo(QuestTemplate, { foreignKey: "id_quest_template" });

export default PetualangQuest;
