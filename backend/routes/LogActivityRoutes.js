import express from "express";
import {
  getLogActivities,
  getLogActivityById,
  createLogActivity,
  updateLogActivity,
  deleteLogActivity,
  ambilMisi,
  getMisiByPetualang,
  misiSelesai
} from "../controllers/LogActivityController.js";

import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post("/ambil-misi", ambilMisi);
router.get("/:id_petualang", verifyToken, getMisiByPetualang);


router.get("/", verifyToken, getLogActivities);
router.get("/:id", verifyToken, getLogActivityById);
router.post("/", verifyToken, createLogActivity);
router.put("/:id", verifyToken, updateLogActivity);
router.delete("/:id", verifyToken, deleteLogActivity);
export default router;
