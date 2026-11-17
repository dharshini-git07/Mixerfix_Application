import express from 'express';
import {
  createPayment,
  getPayments,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createPayment)
  .get(protect, getPayments);

export default router;
