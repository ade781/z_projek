import express from "express";
import {
  createMisiRequest,
  getMisiRequests,
  getMisiRequestByWarga,
  approveMisiRequest,
  rejectMisiRequest,
} from "../controllers/MisiRequestController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post("/", createMisiRequest);
router.get("/", verifyToken, getMisiRequests);
router.get("/warga/:id_warga_desa", getMisiRequestByWarga);
router.post("/:id/approve", verifyToken, approveMisiRequest);
router.post("/:id/reject", verifyToken, rejectMisiRequest);

export default router;
