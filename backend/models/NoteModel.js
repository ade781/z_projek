import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Note = db.define('note', {
    judul: DataTypes.STRING,
    kategori: DataTypes.STRING,
    isi: DataTypes.STRING
}, {
    freezeTableName: true
});
export default Note;
(async () => {
    await db.sync();
})();