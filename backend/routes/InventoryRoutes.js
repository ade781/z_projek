import express from "express";
import {
  getItems,
  getInventory,
  buyItem,
  activateItem,
  deactivateItem,
} from "../controllers/InventoryController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/items", verifyToken, getItems);
router.get("/:id_petualang", verifyToken, getInventory);
router.post("/buy", verifyToken, buyItem);
router.post("/activate", verifyToken, activateItem);
router.post("/deactivate", verifyToken, deactivateItem);

export default router;
