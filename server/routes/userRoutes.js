import express from 'express';
import { updateProfile, getUsers, getDeliveryAgents } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.get('/', protect, authorize('owner'), getUsers);
router.get('/delivery-agents', protect, getDeliveryAgents);

export default router;
