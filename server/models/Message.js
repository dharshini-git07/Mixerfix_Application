import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    repair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Repair',
      required: false, // can be general or attached to a repair
    },
    repairId: {
      type: String,
      default: 'general',
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ['customer', 'owner', 'delivery'],
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    receiverRole: {
      type: String,
      enum: ['customer', 'owner', 'delivery'],
      required: false,
    },
    content: {
      type: String,
      required: [true, 'Message text content is required'],
      trim: true,
    },
    readStatus: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual alias 'text' for 'content' to match frontend
messageSchema.virtual('text').get(function () {
  return this.content;
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
