import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a secure password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'owner', 'delivery'],
      default: 'customer',
    },
    address: {
      type: String,
      default: 'Flat 402, Green Glen Layout, Indiranagar',
    },
    city: {
      type: String,
      default: 'Bangalore',
    },
    pincode: {
      type: String,
      default: '560038',
    },
    avatar: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          this.name || 'User'
        )}&backgroundColor=087F75`;
      },
    },
    // Shop owner specific attributes
    shopName: {
      type: String,
      default: 'Mixer Fix Electronic Repairs & Service Station',
    },
    gstin: {
      type: String,
      default: '29ABCDE1234F1Z5',
    },
    operatingHours: {
      type: String,
      default: '09:00 AM – 08:30 PM (Mon-Sat)',
    },
    // Delivery courier specific attributes
    vehicle: {
      type: String,
      default: 'Hero Electric Nyx (KA-03-EM-8472)',
    },
    vehicleNumber: {
      type: String,
      default: 'KA-03-EM-8472',
    },
    zone: {
      type: String,
      default: 'Central & East Bengaluru (Indiranagar / Koramangala)',
    },
    dutyStatus: {
      type: String,
      enum: ['Active on Duty', 'On Short Break', 'Shift Concluded'],
      default: 'Active on Duty',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
