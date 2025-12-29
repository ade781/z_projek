import express from "express";
import {
  getLogActivities,
  getLogActivityById,
  createLogActivity,
  updateLogActivity,
  deleteLogActivity,
  ambilMisi,
  getMisiByPetualang,
  playMissionNext,
  approveMission,
  rejectMission
} from "../controllers/LogActivityController.js";

import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post("/ambil-misi", verifyToken, ambilMisi);
router.post("/play-mission/next", verifyToken, playMissionNext);
router.post("/approve-mission", verifyToken, approveMission);
router.post("/reject-mission", verifyToken, rejectMission);
router.get("/petualang/:id_petualang", verifyToken, getMisiByPetualang);


router.get("/", verifyToken, getLogActivities);
router.get("/log/:id", verifyToken, getLogActivityById);
router.post("/", verifyToken, createLogActivity);
router.put("/:id", verifyToken, updateLogActivity);
router.delete("/:id", verifyToken, deleteLogActivity);
export default router;
