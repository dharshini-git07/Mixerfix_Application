import User from '../models/User.js';

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.pincode = req.body.pincode || user.pincode;

    // Role-specific field updates
    if (user.role === 'owner') {
      user.shopName = req.body.shopName || user.shopName;
      user.gstin = req.body.gstin || user.gstin;
      user.operatingHours = req.body.operatingHours || user.operatingHours;
    }

    if (user.role === 'delivery') {
      user.vehicle = req.body.vehicle || user.vehicle;
      user.vehicleNumber = req.body.vehicleNumber || user.vehicleNumber;
      user.zone = req.body.zone || req.body.coverageZone || user.zone;
      user.dutyStatus = req.body.dutyStatus || user.dutyStatus;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (filtered by role if specified)
// @route   GET /api/users
// @access  Private (Owner only)
export const getUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active delivery agents
// @route   GET /api/users/delivery-agents
// @access  Private
export const getDeliveryAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: 'delivery' }).select(
      'name phone email vehicle vehicleNumber zone dutyStatus avatar'
    );

    res.status(200).json({
      success: true,
      count: agents.length,
      agents,
    });
  } catch (error) {
    next(error);
  }
};
