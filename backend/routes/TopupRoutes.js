import express from "express";
import {
  createTopupRequest,
  getTopupRequests,
  getTopupByWarga,
  approveTopup,
  rejectTopup,
} from "../controllers/TopupController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post("/", createTopupRequest);
router.get("/", verifyToken, getTopupRequests);
router.get("/warga/:id_warga_desa", getTopupByWarga);
router.post("/:id/approve", verifyToken, approveTopup);
router.post("/:id/reject", verifyToken, rejectTopup);

export default router;
