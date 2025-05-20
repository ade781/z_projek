import { where } from "sequelize";
import Note from "../models/NoteModel.js";

// buat metod nya kita ngeget dulu 

export const getNotes = async (req, res) => {
    try {
        const response = await Note.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};
export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Catatan tidak ditemukan" });
        }
        res.status(200).json(note);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Gagal mengambil data catatan" });
    }
};

export const createNotes = async (req, res) => {
    try {
        await Note.create(req.body);
        res.status(201).json({ msg: "Note created" });
    } catch (error) {
        console.log(error.message);
    }
};



export const updateNote = async (req, res) => {
    try {
        await Note.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Note update" })
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteNote = async (req, res) => {
    try {
        await Note.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Note update" })
    } catch (error) {
        console.log(error.message);
    }
}