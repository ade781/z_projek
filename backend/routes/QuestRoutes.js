import express from "express";
import {
  getActiveQuests,
  claimQuest,
  getQuestPeriod,
} from "../controllers/QuestController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/period", verifyToken, getQuestPeriod);
router.get("/active/:id_petualang", verifyToken, getActiveQuests);
router.post("/claim", verifyToken, claimQuest);

export default router;
