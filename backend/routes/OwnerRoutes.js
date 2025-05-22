import express from "express";
import {
    getOwners,
    createOwner,
    updateOwner,
    deleteOwner,
    getOwnerById,
    loginOwner,
    logoutOwner
} from "../controllers/OwnerController.js";

import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get('/token', refreshToken);

router.post('/login', loginOwner);
router.delete('/logout', logoutOwner);

router.get('/', verifyToken, getOwners);
router.get('/:id', verifyToken, getOwnerById);
router.post('/add-owner', createOwner);   // <-- POST /owner untuk create owner
router.put('/edit-owner/:id', verifyToken, updateOwner);
router.delete('/delete-owner/:id', verifyToken, deleteOwner);

export default router;
