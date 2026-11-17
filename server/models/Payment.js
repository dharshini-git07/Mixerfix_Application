import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
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
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Debit/Credit Card', 'Cash on Delivery', 'Card'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed'],
      default: 'Paid',
    },
    transactionReference: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual alias 'id' and 'method' for frontend consistency
paymentSchema.virtual('id').get(function () {
  return this.paymentId;
});

paymentSchema.virtual('method').get(function () {
  return this.paymentMethod;
});

paymentSchema.virtual('status').get(function () {
  return this.paymentStatus;
});

paymentSchema.virtual('date').get(function () {
  return this.paymentDate ? this.paymentDate.toISOString().split('T')[0] : '';
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
