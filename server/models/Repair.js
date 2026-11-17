import mongoose from 'mongoose';

const repairSchema = new mongoose.Schema(
  {
    repairId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Appliance category is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      default: 'Standard Unit',
      trim: true,
    },
    problem: {
      type: String,
      required: [true, 'Problem description is required'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
    pickupAddress: {
      type: String,
      required: [true, 'Pickup address is required'],
      trim: true,
    },
    city: {
      type: String,
      default: 'Bangalore',
    },
    pincode: {
      type: String,
      default: '560001',
    },
    preferredPickupDate: {
      type: String,
      required: true,
    },
    preferredTimeSlot: {
      type: String,
      default: '10:00 AM - 01:00 PM',
    },
    estimatedCost: {
      type: Number,
      default: null,
    },
    actualCost: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: [
        'Requested',
        'Approved',
        'Pickup Assigned',
        'Collected',
        'At Shop',
        'Repair in Progress',
        'Completed',
        'Out for Delivery',
        'Delivered',
        'Rejected',
      ],
      default: 'Requested',
    },
    technicianNotes: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    partsReplaced: {
      type: [String],
      default: [],
    },
    assignedPickupCourier: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: null },
      phone: { type: String, default: null },
    },
    assignedReturnCourier: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: null },
      phone: { type: String, default: null },
    },
    deliveryType: {
      type: String,
      enum: ['pickup', 'return', 'pickup_completed', 'ready_for_return', 'delivered', null],
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      default: null,
    },
    paymentId: {
      type: String,
      default: null,
    },
    approvedAt: { type: Date },
    pickupAssignedAt: { type: Date },
    collectedAt: { type: Date },
    atShopAt: { type: Date },
    inProgressAt: { type: Date },
    completedAt: { type: Date },
    outForDeliveryAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual properties to ensure 100% backward compatibility with frontend naming conventions
repairSchema.virtual('id').get(function () {
  return this.repairId;
});

repairSchema.virtual('appliance').get(function () {
  return this.category;
});

repairSchema.virtual('issue').get(function () {
  return this.problem;
});

repairSchema.virtual('cost').get(function () {
  return this.actualCost !== null ? this.actualCost : this.estimatedCost;
});

repairSchema.virtual('address').get(function () {
  return this.pickupAddress;
});

repairSchema.virtual('pickupDate').get(function () {
  return this.preferredPickupDate;
});

repairSchema.virtual('assignedCourier').get(function () {
  return (
    this.assignedReturnCourier?.name ||
    this.assignedPickupCourier?.name ||
    null
  );
});

const Repair = mongoose.model('Repair', repairSchema);
export default Repair;
