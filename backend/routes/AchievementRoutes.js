import express from "express";
import {
  getAchievements,
  getPetualangAchievements,
} from "../controllers/AchievementController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getAchievements);
router.get("/:id_petualang", verifyToken, getPetualangAchievements);

export default router;
