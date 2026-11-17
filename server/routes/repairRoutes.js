import express from 'express';
import {
  createRepair,
  getMyRepairs,
  getAllRepairs,
  getRepairById,
  approveRepair,
  rejectRepair,
  updateRepairStatus,
  updateRepairCost,
} from '../controllers/repairController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadMedia } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(
    protect,
    uploadMedia.fields([
      { name: 'images', maxCount: 6 },
      { name: 'videos', maxCount: 2 },
    ]),
    createRepair
  )
  .get(protect, getAllRepairs);

router.get('/my-repairs', protect, getMyRepairs);
router.get('/:id', protect, getRepairById);

router.patch('/:id/approve', protect, authorize('owner'), approveRepair);
router.patch('/:id/reject', protect, authorize('owner'), rejectRepair);
router.patch('/:id/status', protect, updateRepairStatus);
router.patch('/:id/cost', protect, authorize('owner'), updateRepairCost);

export default router;
