import express from "express";
import {
  getNotifications,
  markNotificationRead,
  markAllRead,
} from "../controllers/NotificationController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/:id_petualang", verifyToken, getNotifications);
router.put("/:id/read", verifyToken, markNotificationRead);
router.put("/petualang/:id_petualang/read-all", verifyToken, markAllRead);

export default router;
