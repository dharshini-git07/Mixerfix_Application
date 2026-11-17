import Repair from '../models/Repair.js';
import User from '../models/User.js';
import { generateRepairId } from '../utils/generateRepairId.js';
import { sendNotificationEmail } from '../utils/emailService.js';

// @desc    Register a new repair complaint (Customer)
// @route   POST /api/repairs
// @access  Private (Customer)
export const createRepair = async (req, res, next) => {
  try {
    const {
      category,
      appliance,
      brand,
      model,
      problem,
      issue,
      pickupAddress,
      address,
      city,
      pincode,
      preferredPickupDate,
      pickupDate,
      preferredTimeSlot,
    } = req.body;

    const repairId = await generateRepairId();

    // Process uploaded files if provided via Multer
    let uploadedImages = [];
    let uploadedVideos = [];

    if (req.files) {
      if (req.files.images) {
        uploadedImages = req.files.images.map((f) => `/uploads/${f.filename}`);
      }
      if (req.files.videos) {
        uploadedVideos = req.files.videos.map((f) => `/uploads/${f.filename}`);
      }
    }

    // Also support string URLs/base64 passed in JSON body
    if (req.body.images && Array.isArray(req.body.images)) {
      uploadedImages = [...uploadedImages, ...req.body.images];
    }
    if (req.body.videos && Array.isArray(req.body.videos)) {
      uploadedVideos = [...uploadedVideos, ...req.body.videos];
    }

    const newRepair = await Repair.create({
      repairId,
      customer: req.user._id,
      customerName: req.user.name,
      customerPhone: req.user.phone,
      customerEmail: req.user.email,
      category: category || appliance || 'Mixer and Grinder',
      brand: brand || 'Appliance',
      model: model || 'Standard',
      problem: problem || issue || 'General maintenance required',
      images: uploadedImages,
      videos: uploadedVideos,
      pickupAddress: pickupAddress || address || req.user.address || 'Doorstep',
      city: city || req.user.city || 'Bangalore',
      pincode: pincode || req.user.pincode || '560001',
      preferredPickupDate: preferredPickupDate || pickupDate || new Date().toISOString().split('T')[0],
      preferredTimeSlot: preferredTimeSlot || '10:00 AM - 01:00 PM',
      status: 'Requested',
    });

    // Notify customer via simulated email
    sendNotificationEmail({
      to: req.user.email,
      subject: `Repair Request Received: ${repairId}`,
      text: `Hello ${req.user.name}, your repair ticket for ${newRepair.brand} ${newRepair.category} has been received. Our workshop team will review and approve it shortly.`,
    });

    // Emit Socket.IO event if available
    const io = req.app.get('io');
    if (io) {
      io.emit('repair:created', newRepair);
    }

    res.status(201).json({
      success: true,
      message: 'Repair complaint submitted successfully',
      repair: newRepair,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current customer's repair history
// @route   GET /api/repairs/my-repairs
// @access  Private (Customer)
export const getMyRepairs = async (req, res, next) => {
  try {
    const repairs = await Repair.find({
      $or: [{ customer: req.user._id }, { customerEmail: req.user.email }],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: repairs.length,
      repairs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all repairs (Shop owner & delivery view)
// @route   GET /api/repairs
// @access  Private (Owner, Delivery)
export const getAllRepairs = async (req, res, next) => {
  try {
    const filter = {};

    // Filter by status if requested
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter for delivery courier tasks
    if (req.user.role === 'delivery') {
      filter.$or = [
        { 'assignedPickupCourier.id': req.user._id },
        { 'assignedReturnCourier.id': req.user._id },
        { 'assignedPickupCourier.name': req.user.name },
        { 'assignedReturnCourier.name': req.user.name },
        { status: { $in: ['Pickup Assigned', 'Collected', 'Out for Delivery'] } },
      ];
    }

    // Search query
    if (req.query.search) {
      const q = req.query.search;
      filter.$or = [
        { repairId: { $regex: q, $options: 'i' } },
        { customerName: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }

    const repairs = await Repair.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: repairs.length,
      repairs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single repair by ID or repairId (e.g. REP-1001)
// @route   GET /api/repairs/:id
// @access  Private
export const getRepairById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const repair = await Repair.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { repairId: id.toUpperCase() }],
    }).populate('customer', 'name email phone address avatar');

    if (!repair) {
      return res.status(404).json({ success: false, message: 'Repair record not found' });
    }

    res.status(200).json({
      success: true,
      repair,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve repair request & set initial estimated cost (Shop Owner)
// @route   PATCH /api/repairs/:id/approve
// @access  Private (Owner)
export const approveRepair = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estimatedCost, notes } = req.body;

    const repair = await Repair.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { repairId: id.toUpperCase() }],
    });

    if (!repair) {
      return res.status(404).json({ success: false, message: 'Repair record not found' });
    }

    repair.status = 'Approved';
    repair.estimatedCost = Number(estimatedCost) || repair.estimatedCost || 500;
    repair.actualCost = repair.estimatedCost;
    if (notes) repair.technicianNotes = notes;
    repair.approvedAt = new Date();

    await repair.save();

    // Socket.io emit
    const io = req.app.get('io');
    if (io) {
      io.emit('repair:updated', repair);
    }

    sendNotificationEmail({
      to: repair.customerEmail,
      subject: `Repair Approved: ${repair.repairId}`,
      text: `Good news! Your repair request for ${repair.brand} ${repair.category} has been approved with an estimate of ₹${repair.estimatedCost}.`,
    });

    res.status(200).json({
      success: true,
      message: 'Repair request approved successfully',
      repair,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject repair request (Shop Owner)
// @route   PATCH /api/repairs/:id/reject
// @access  Private (Owner)
export const rejectRepair = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const repair = await Repair.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { repairId: id.toUpperCase() }],
    });

    if (!repair) {
      return res.status(404).json({ success: false, message: 'Repair record not found' });
    }

    repair.status = 'Rejected';
    repair.rejectionReason = reason || 'Appliance cannot be serviced at this time.';

    await repair.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('repair:updated', repair);
    }

    res.status(200).json({
      success: true,
      message: 'Repair request rejected',
      repair,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update repair status across 9 stages
// @route   PATCH /api/repairs/:id/status
// @access  Private (Owner, Delivery)
export const updateRepairStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, partsReplaced } = req.body;

    const repair = await Repair.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { repairId: id.toUpperCase() }],
    });

    if (!repair) {
      return res.status(404).json({ success: false, message: 'Repair record not found' });
    }

    repair.status = status;

    if (notes) repair.technicianNotes = notes;
    if (partsReplaced && Array.isArray(partsReplaced)) {
      repair.partsReplaced = partsReplaced;
    }

    const now = new Date();
    switch (status) {
      case 'Collected':
        repair.collectedAt = now;
        break;
      case 'At Shop':
        repair.atShopAt = now;
        break;
      case 'Repair in Progress':
        repair.inProgressAt = now;
        break;
      case 'Completed':
        repair.completedAt = now;
        break;
      case 'Out for Delivery':
        repair.outForDeliveryAt = now;
        break;
      case 'Delivered':
        repair.deliveredAt = now;
        break;
    }

    await repair.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('repair:updated', repair);
    }

    res.status(200).json({
      success: true,
      message: `Repair stage transitioned to ${status}`,
      repair,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update repair cost (Shop Owner)
// @route   PATCH /api/repairs/:id/cost
// @access  Private (Owner)
export const updateRepairCost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cost, estimatedCost, actualCost } = req.body;

    const repair = await Repair.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { repairId: id.toUpperCase() }],
    });

    if (!repair) {
      return res.status(404).json({ success: false, message: 'Repair record not found' });
    }

    const costVal = Number(cost || actualCost || estimatedCost);
    repair.estimatedCost = costVal;
    repair.actualCost = costVal;

    await repair.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('repair:updated', repair);
    }

    res.status(200).json({
      success: true,
      message: 'Repair cost updated successfully',
      repair,
    });
  } catch (error) {
    next(error);
  }
};
