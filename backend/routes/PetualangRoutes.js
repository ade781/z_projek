import express from "express";
import {
  getPetualangs,
  createPetualang,
  updatePetualang,
  deletePetualang,
  getPetualangById,
  loginPetualang,
  logoutPetualang
} from "../controllers/PetualangController.js";

import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// Token refresh
router.get('/token', refreshToken);

// Auth routes (login/logout)
router.post('/login', loginPetualang);
router.delete('/logout', logoutPetualang);

// CRUD petualang
router.get('/', verifyToken, getPetualangs);
router.get('/:id', verifyToken, getPetualangById);
router.post('/add-petualang', createPetualang);
router.put('/edit-petualang/:id', updatePetualang);
router.delete('/delete-petualang/:id', verifyToken, deletePetualang);

export default router;
