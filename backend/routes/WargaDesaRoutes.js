import express from "express";
import {
  registerWarga,
  loginWarga,
  getWargaById,
} from "../controllers/WargaDesaController.js";

const router = express.Router();

router.post("/register", registerWarga);
router.post("/login", loginWarga);
router.get("/:id", getWargaById);

export default router;
