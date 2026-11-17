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
    customerEmail: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed', 'Authorized', 'Captured', 'Created', 'Refunded'],
      default: 'Pending',
      index: true,
    },
    transactionReference: {
      type: String,
      default: '',
    },
    // Razorpay Integration Attributes
    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
      index: true,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    signatureVerified: {
      type: Boolean,
      default: false,
    },
    receiptNumber: {
      type: String,
      default: null,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    failureReason: {
      type: String,
      default: null,
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

// Virtual aliases for frontend compatibility
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
