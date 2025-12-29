import express from "express";
import {
  getGuilds,
  getGuildById,
  createGuild,
  joinGuild,
  leaveGuild,
  transferLeader,
  getGuildMembers,
  getGuildByPetualang,
} from "../controllers/GuildController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getGuilds);
router.get("/petualang/:id_petualang", verifyToken, getGuildByPetualang);
router.get("/:id", verifyToken, getGuildById);
router.post("/", verifyToken, createGuild);
router.post("/:id_guild/join", verifyToken, joinGuild);
router.post("/:id_guild/leave", verifyToken, leaveGuild);
router.post("/:id_guild/transfer", verifyToken, transferLeader);
router.get("/:id_guild/members", verifyToken, getGuildMembers);

export default router;
