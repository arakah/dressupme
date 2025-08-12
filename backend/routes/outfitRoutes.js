import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import {
  createOutfit,
  getUserOutfits,
  deleteOutfit
} from '../controllers/outfitController.js';

const router = express.Router();

router.post('/', authenticateToken, createOutfit);
router.get('/', authenticateToken, getUserOutfits);
router.delete('/:id', authenticateToken, deleteOutfit);

export default router;
