import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mixerfix';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Successfully connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.warn(
      `[MongoDB Guide] To connect to MongoDB Atlas, add your Atlas connection string to server/.env:\n` +
      `  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mixerfix?retryWrites=true&w=majority\n`
    );
    return false;
  }
};
