import express from "express";
import {
    createNotes,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
} from "../controllers/NoteController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// Semua endpoint pakai verifyToken
router.get('/note', verifyToken, getNotes);
router.get('/note/:id', verifyToken, getNoteById);
router.post('/note', verifyToken, createNotes);
router.put('/note/:id', verifyToken, updateNote);
router.delete('/note/:id', verifyToken, deleteNote);

export default router;
