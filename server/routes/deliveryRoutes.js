import express from 'express';
import {
  getDeliveries,
  assignDelivery,
  updateDeliveryStatus,
} from '../controllers/deliveryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getDeliveries);

router.post('/assign', protect, authorize('owner'), assignDelivery);
router.patch('/:id/status', protect, updateDeliveryStatus);

export default router;
