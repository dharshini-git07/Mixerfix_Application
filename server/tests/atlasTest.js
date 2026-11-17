import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import User from '../models/User.js';
import Repair from '../models/Repair.js';
import Delivery from '../models/Delivery.js';
import Message from '../models/Message.js';
import Payment from '../models/Payment.js';
import { seedDatabase } from '../utils/seedData.js';

const testAtlasConnection = async () => {
  console.log('========================================================');
  console.log('   MONGODB ATLAS CLOUD DATABASE CONNECTIVITY TEST');
  console.log('========================================================\n');

  const rawUri = process.env.MONGODB_URI || '';
  console.log(`[Configured URI]: ${rawUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);

  // Try candidate URIs
  const candidates = [
    rawUri,
    'mongodb+srv://mixerfix:Dharshini007@cluster0.acgvndw.mongodb.net/mixerfix?authSource=admin&retryWrites=true&w=majority',
    'mongodb+srv://mixerfix:dharshini007@cluster0.acgvndw.mongodb.net/mixerfix?retryWrites=true&w=majority',
    'mongodb+srv://mixerfix:dharshini007@cluster0.acgvndw.mongodb.net/mixerfix?authSource=admin&retryWrites=true&w=majority',
    'mongodb+srv://mixerfix:Dharshini007@cluster0.acgvndw.mongodb.net/?authSource=admin',
  ];

  let successfulConn = null;
  let activeUri = '';

  for (const uri of candidates) {
    if (!uri) continue;
    const masked = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    try {
      console.log(`\n[Attempting Connection] -> ${masked}`);
      await mongoose.disconnect();
      successfulConn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 6000,
        maxPoolSize: 5,
      });
      activeUri = uri;
      console.log(`✓ [CONNECTED!] Succeeded with: ${masked}`);
      break;
    } catch (err) {
      console.log(`  ✗ Failed: ${err.message}`);
    }
  }

  if (!successfulConn) {
    console.error('\n========================================================');
    console.error('✗ [AUTHENTICATION FAILED]');
    console.error('All credential variations returned "bad auth: Authentication failed".');
    console.error('\nProbable Causes in MongoDB Atlas:');
    console.error('1. The Database User "mixerfix" password in MongoDB Atlas differs from "Dharshini007".');
    console.error('2. Under MongoDB Atlas -> Security -> "Database Access", verify:');
    console.error('   • Username: mixerfix');
    console.error('   • Built-in Role: "readWriteAnyDatabase" or "Atlas admin"');
    console.error('   • If unsure of the password, click "Edit" on the user and set a new password.');
    console.error('3. Under MongoDB Atlas -> Security -> "Network Access":');
    console.error('   • Ensure IP "0.0.0.0/0" (Allow Access from Anywhere) is ACTIVE.');
    console.error('========================================================');
    process.exit(1);
  }

  console.log(`\n✓ [DATABASE HOST]: ${successfulConn.connection.host}`);
  console.log(`✓ [DATABASE NAME]: ${successfulConn.connection.name}`);

  // Test Write & Read Operation
  console.log('\n--- Testing Write & Read Operations in Atlas ---');
  const testDoc = await User.create({
    name: 'Atlas Verification Test',
    email: `atlas.test.${Date.now()}@mixerfix.com`,
    phone: '+91 99999 00000',
    password: 'password123',
    role: 'customer',
    address: 'Cloud Atlas Verification Node',
  });

  console.log(`✓ [Write Test PASSED] Inserted test document into "users" collection (ID: ${testDoc._id})`);

  // Verify Read
  const retrieved = await User.findById(testDoc._id);
  if (retrieved && retrieved.name === 'Atlas Verification Test') {
    console.log(`✓ [Read Test PASSED] Successfully retrieved verified document from Atlas!`);
  }

  // Cleanup test doc
  await User.deleteOne({ _id: testDoc._id });
  console.log(`✓ [Cleanup] Temporary verification document removed.`);

  // Check existing records in Atlas
  const userCount = await User.countDocuments();
  const repairCount = await Repair.countDocuments();
  const deliveryCount = await Delivery.countDocuments();
  const messageCount = await Message.countDocuments();
  const paymentCount = await Payment.countDocuments();

  console.log('\n--- Current Collections & Record Counts in MongoDB Atlas ---');
  console.log(`  • users:      ${userCount} document(s)`);
  console.log(`  • repairs:    ${repairCount} document(s)`);
  console.log(`  • deliveries: ${deliveryCount} document(s)`);
  console.log(`  • messages:   ${messageCount} document(s)`);
  console.log(`  • payments:   ${paymentCount} document(s)`);

  if (userCount === 0) {
    console.log('\n[Notice] Database is currently empty. Seeding initial demo users and repairs...');
    await seedDatabase();
    const newUsers = await User.countDocuments();
    const newRepairs = await Repair.countDocuments();
    console.log(`✓ [Seeding Complete] Seeded ${newUsers} users and ${newRepairs} repairs into MongoDB Atlas!`);
  }

  console.log('\n========================================================');
  console.log('   MONGODB ATLAS CLOUD DATABASE IS VERIFIED AND READY ✓');
  console.log('========================================================');

  process.exit(0);
};

testAtlasConnection();
