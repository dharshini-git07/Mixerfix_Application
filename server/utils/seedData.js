import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.js';
import Repair from '../models/Repair.js';
import Delivery from '../models/Delivery.js';
import Message from '../models/Message.js';
import Payment from '../models/Payment.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sampleUsers = [
  {
    name: 'Rahul Sharma',
    email: 'customer@mixerfix.com',
    phone: '+91 98765 43210',
    password: 'password123',
    role: 'customer',
    address: 'Flat 402, Green Valley Heights, 12th Main, Indiranagar',
    city: 'Bangalore',
    pincode: '560038',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  },
  {
    name: 'Suresh Kumar',
    email: 'owner@mixerfix.com',
    phone: '+91 98450 12345',
    password: 'password123',
    role: 'owner',
    address: 'Shop #14, Tech Plaza, Brigade Road',
    city: 'Bangalore',
    pincode: '560001',
    shopName: 'Master Electronics Workshop & Spares',
    gstin: '29ABCDE1234F1Z5',
    operatingHours: '09:00 AM – 08:30 PM (Mon-Sat)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  {
    name: 'Amit Patel',
    email: 'delivery@mixerfix.com',
    phone: '+91 91234 56780',
    password: 'password123',
    role: 'delivery',
    vehicle: 'Hero Electric Nyx (KA-03-EM-8472)',
    vehicleNumber: 'KA-03-EM-8472',
    zone: 'East Bengaluru (Indiranagar / Koramangala / Whitefield)',
    dutyStatus: 'Active on Duty',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.delivery@mixerfix.com',
    phone: '+91 99887 76655',
    password: 'password123',
    role: 'delivery',
    vehicle: 'Bajaj Chetak EV (KA-05-JX-1190)',
    vehicleNumber: 'KA-05-JX-1190',
    zone: 'South Bengaluru (Jayanagar / JP Nagar)',
    dutyStatus: 'Active on Duty',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
];

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already contains records. Skipping seed.');
      return;
    }

    console.log('[Seed] Seeding initial users and sample repairs...');

    // Seed users
    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    const customerUser = createdUsers.find((u) => u.role === 'customer');
    const ownerUser = createdUsers.find((u) => u.role === 'owner');
    const courierUser = createdUsers.find((u) => u.role === 'delivery');

    // Seed Sample Repairs
    const sampleRepairs = [
      {
        repairId: 'REP-1001',
        customer: customerUser._id,
        customerName: customerUser.name,
        customerPhone: customerUser.phone,
        customerEmail: customerUser.email,
        category: 'Mixer and Grinder',
        brand: 'Philips',
        model: 'HL7756/00 750W Turbo',
        problem: 'Motor makes loud humming noise, jar coupler is shredded and slight burning smell on speed 3.',
        images: [
          'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
        ],
        pickupAddress: customerUser.address,
        city: customerUser.city,
        pincode: customerUser.pincode,
        preferredPickupDate: '2026-11-18',
        preferredTimeSlot: '10:00 AM - 01:00 PM',
        status: 'Repair in Progress',
        estimatedCost: 650,
        actualCost: 650,
        partsReplaced: ['Heavy Duty Coupler Teeth', 'Carbon Brushes (Pair)'],
        technicianNotes: 'Armature windings tested OK. Replaced worn carbon brushes and motor coupler.',
        assignedPickupCourier: {
          id: courierUser._id,
          name: courierUser.name,
          phone: courierUser.phone,
        },
        deliveryType: 'pickup_completed',
        paymentStatus: 'Pending',
      },
      {
        repairId: 'REP-1002',
        customer: customerUser._id,
        customerName: customerUser.name,
        customerPhone: customerUser.phone,
        customerEmail: customerUser.email,
        category: 'Washing Machine',
        brand: 'Samsung',
        model: 'WA65A4002VS Top Load 6.5kg',
        problem: 'Spin drum stops abruptly with OE drainage error, water remaining inside tub after wash cycle.',
        pickupAddress: customerUser.address,
        city: customerUser.city,
        pincode: customerUser.pincode,
        preferredPickupDate: '2026-11-19',
        status: 'Approved',
        estimatedCost: 1200,
        actualCost: 1200,
        technicianNotes: 'Estimated based on drain pump actuator replacement requirement.',
        paymentStatus: 'Pending',
      },
      {
        repairId: 'REP-1003',
        customer: customerUser._id,
        customerName: customerUser.name,
        customerPhone: customerUser.phone,
        customerEmail: customerUser.email,
        category: 'Microwave Oven',
        brand: 'IFB',
        model: '20PG3S 20L Grill',
        problem: 'Turns on and turntable rotates, but food does not heat up at all. Spark observed inside chamber.',
        pickupAddress: customerUser.address,
        city: customerUser.city,
        pincode: customerUser.pincode,
        preferredPickupDate: '2026-11-20',
        status: 'Delivered',
        estimatedCost: 850,
        actualCost: 850,
        technicianNotes: 'High voltage diode and mica waveguide sheet replaced. Heating output tested.',
        assignedPickupCourier: { id: courierUser._id, name: courierUser.name, phone: courierUser.phone },
        assignedReturnCourier: { id: courierUser._id, name: courierUser.name, phone: courierUser.phone },
        paymentStatus: 'Paid',
        paymentMethod: 'UPI',
        paymentId: 'TXN-UPI-4829103',
      },
    ];

    for (const r of sampleRepairs) {
      const repair = await Repair.create(r);

      // Create payment for delivered repair
      if (repair.paymentStatus === 'Paid') {
        await Payment.create({
          paymentId: `PAY-101`,
          repair: repair._id,
          repairId: repair.repairId,
          customer: customerUser._id,
          customerName: customerUser.name,
          amount: repair.actualCost,
          paymentMethod: 'UPI',
          paymentStatus: 'Paid',
          transactionReference: 'TXN-UPI-4829103',
          paymentDate: new Date(),
        });
      }

      // Create sample chat
      await Message.create({
        repair: repair._id,
        repairId: repair.repairId,
        sender: customerUser._id,
        senderName: customerUser.name,
        senderRole: 'customer',
        content: `Hi Suresh, is genuine replacement parts used for ${repair.brand} ${repair.category}?`,
        timestamp: new Date(Date.now() - 3600000),
      });

      await Message.create({
        repair: repair._id,
        repairId: repair.repairId,
        sender: ownerUser._id,
        senderName: 'Suresh Kumar (Shop Owner)',
        senderRole: 'owner',
        content: `Hello ${customerUser.name}! Yes, 100% genuine OEM factory parts with a 90-day warranty.`,
        timestamp: new Date(),
      });
    }

    console.log('[Seed] Database seeded successfully with demo users, repairs, chats, and payments.');
  } catch (error) {
    console.error('[Seed Error] Failed to seed data:', error.message);
  }
};

// Allow running directly via CLI `node utils/seedData.js`
if (process.argv[1]?.includes('seedData.js')) {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mixerfix';
  mongoose
    .connect(uri)
    .then(async () => {
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
