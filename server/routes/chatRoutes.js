import express from 'express';
import {
  getMessagesByRepairId,
  sendMessage,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:repairId', protect, getMessagesByRepairId);
router.post('/:repairId', protect, sendMessage);

export default router;
