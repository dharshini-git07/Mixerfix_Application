import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema(
  {
    repair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repair',
      required: true,
    },
    repairId: {
      type: String,
      required: true,
      index: true,
    },
    courier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courierName: {
      type: String,
      required: true,
    },
    courierPhone: {
      type: String,
      required: true,
    },
    deliveryType: {
      type: String,
      enum: ['pickup', 'return'],
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
    pickupAddress: {
      type: String,
      required: true,
    },
    destinationAddress: {
      type: String,
      required: true,
    },
    deliveryStatus: {
      type: String,
      enum: ['Assigned', 'In Transit', 'Completed', 'Cancelled'],
      default: 'Assigned',
    },
    assignmentDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery;
