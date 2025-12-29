import express from "express";
import {
  getMisis,
  getMisiById,
  createMisi,
  updateMisi,
  deleteMisi,
  ambilMisi,
  getMisiParticipants,
  
} from "../controllers/MisiController.js";

import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getMisis);
router.get("/:id/participants", verifyToken, getMisiParticipants);
router.get("/:id", verifyToken, getMisiById);
router.post("/", verifyToken, createMisi);
router.put("/:id", verifyToken, updateMisi);
router.delete("/:id", verifyToken, deleteMisi);
router.post("/ambil-misi", verifyToken, ambilMisi);



export default router;
