import express from "express";
import {
  createListing,
  getListings,
  buyListing,
  getTransactions,
} from "../controllers/MarketController.js";

const router = express.Router();

router.post("/listings", createListing);
router.get("/listings", getListings);
router.post("/buy/:id", buyListing);
router.get("/transactions/:role/:id", getTransactions);

export default router;
