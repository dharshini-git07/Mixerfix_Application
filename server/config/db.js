import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows / Node.js querySrv ECONNREFUSED with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Silent fallback
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mixerfix';
  const sanitizedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log(`[MongoDB Atlas] Successfully connected to host: ${conn.connection.host} | Database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB Runtime Error]: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB Notice] Connection lost. Attempting reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB Notice] Reconnection restored successfully.');
    });

    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to database at ${sanitizedUri}: ${error.message}`);
    console.warn(
      `[MongoDB Atlas Instructions] To connect MongoDB Atlas in production, set MONGODB_URI in Render environment settings:\n` +
      `  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/mixerfix?retryWrites=true&w=majority\n`
    );
    return false;
  }
};
