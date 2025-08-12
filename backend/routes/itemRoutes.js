import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import {
  uploadItem,
  getUserItems,
  deleteItem
} from '../controllers/itemController.js';

const router = express.Router();
const upload = multer(); // memory storage

router.post('/', authenticateToken, upload.single('image'), uploadItem);
router.get('/', authenticateToken, getUserItems);
router.delete('/:id', authenticateToken, deleteItem);

export default router;
