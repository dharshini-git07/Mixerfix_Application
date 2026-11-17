import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
  getMyPayments,
  getPaymentById,
  createPayment,
  getPayments,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Razorpay Payment Endpoints
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);
router.post('/webhook', handleRazorpayWebhook);
router.get('/my-payments', protect, getMyPayments);

// Base Ledger & Simulated Endpoints
router.route('/')
  .post(protect, createPayment)
  .get(protect, getPayments);

router.get('/:paymentId', protect, getPaymentById);

export default router;
