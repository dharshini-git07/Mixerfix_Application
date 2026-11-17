import Delivery from '../models/Delivery.js';
import Repair from '../models/Repair.js';
import User from '../models/User.js';

// @desc    Get all deliveries (filtered for courier if courier logged in)
// @route   GET /api/deliveries
// @access  Private (Owner, Delivery)
export const getDeliveries = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === 'delivery') {
      filter.$or = [{ courier: req.user._id }, { courierName: req.user.name }];
    }

    if (req.query.status) {
      filter.deliveryStatus = req.query.status;
    }

    if (req.query.type) {
      filter.deliveryType = req.query.type;
    }

    const deliveries = await Delivery.find(filter)
      .populate('repair')
      .populate('courier', 'name phone vehicle zone dutyStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deliveries.length,
      deliveries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign courier for pickup or return delivery (Shop Owner)
// @route   POST /api/deliveries/assign
// @access  Private (Owner)
export const assignDelivery = async (req, res, next) => {
  try {
    const { repairId, courierId, courierName, deliveryType } = req.body;

    // Find repair
    const repair = await Repair.findOne({
      $or: [{ _id: repairId.match(/^[0-9a-fA-F]{24}$/) ? repairId : null }, { repairId: repairId.toUpperCase() }],
    });

    if (!repair) {
      return res.status(404).json({ success: false, message: 'Repair record not found' });
    }

    // Find courier user
    let courierUser = null;
    if (courierId) {
      courierUser = await User.findById(courierId);
    }
    if (!courierUser && courierName) {
      courierUser = await User.findOne({ name: courierName, role: 'delivery' });
    }
    if (!courierUser) {
      courierUser = await User.findOne({ role: 'delivery' });
    }

    const type = deliveryType || (repair.status === 'Completed' ? 'return' : 'pickup');
    const isPickup = type === 'pickup';

    // Create delivery task
    const delivery = await Delivery.create({
      repair: repair._id,
      repairId: repair.repairId,
      courier: courierUser._id,
      courierName: courierUser.name,
      courierPhone: courierUser.phone,
      deliveryType: type,
      customerName: repair.customerName,
      customerPhone: repair.customerPhone,
      pickupAddress: isPickup ? repair.pickupAddress : 'Mixer Fix Central Workshop, Brigade Road',
      destinationAddress: isPickup ? 'Mixer Fix Central Workshop, Brigade Road' : repair.pickupAddress,
      deliveryStatus: 'Assigned',
      assignmentDate: new Date(),
    });

    // Update repair status and courier assignment
    if (isPickup) {
      repair.status = 'Pickup Assigned';
      repair.deliveryType = 'pickup';
      repair.pickupAssignedAt = new Date();
      repair.assignedPickupCourier = {
        id: courierUser._id,
        name: courierUser.name,
        phone: courierUser.phone,
      };
    } else {
      repair.status = 'Out for Delivery';
      repair.deliveryType = 'return';
      repair.outForDeliveryAt = new Date();
      repair.assignedReturnCourier = {
        id: courierUser._id,
        name: courierUser.name,
        phone: courierUser.phone,
      };
    }

    await repair.save();

    // Socket.io emit
    const io = req.app.get('io');
    if (io) {
      io.emit('delivery:assigned', delivery);
      io.emit('repair:updated', repair);
    }

    res.status(201).json({
      success: true,
      message: `Courier ${courierUser.name} assigned for ${type} successfully`,
      delivery,
      repair,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update delivery task status (In Transit, Completed, etc.)
// @route   PATCH /api/deliveries/:id/status
// @access  Private (Owner, Delivery)
export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery record not found' });
    }

    delivery.deliveryStatus = status;
    if (notes) delivery.notes = notes;

    if (status === 'Completed') {
      delivery.completionDate = new Date();
    }

    await delivery.save();

    // Synchronize the parent Repair status
    const repair = await Repair.findById(delivery.repair);
    if (repair) {
      if (delivery.deliveryType === 'pickup') {
        if (status === 'In Transit') repair.status = 'Collected';
        if (status === 'Completed') repair.status = 'At Shop';
      } else if (delivery.deliveryType === 'return') {
        if (status === 'In Transit') repair.status = 'Out for Delivery';
        if (status === 'Completed') repair.status = 'Delivered';
      }
      await repair.save();
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('delivery:updated', delivery);
      if (repair) io.emit('repair:updated', repair);
    }

    res.status(200).json({
      success: true,
      message: `Delivery status updated to ${status}`,
      delivery,
      repair,
    });
  } catch (error) {
    next(error);
  }
};
