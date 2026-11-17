import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import repairRoutes from './routes/repairRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const io = new SocketIOServer(server, {
  cors: {
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Attach io to Express app for use in controllers
app.set('io', io);

// Core Middleware
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static route for uploaded images and videos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Mixer Fix API Server',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);

// Socket.IO Real-Time Communications
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Join repair-specific chat room
  socket.on('join:room', (room) => {
    socket.join(room);
    console.log(`[Socket.IO] Client ${socket.id} joined room: ${room}`);
  });

  socket.on('leave:room', (room) => {
    socket.leave(room);
    console.log(`[Socket.IO] Client ${socket.id} left room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start Server and Database
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbConnected = await connectDB();
  if (dbConnected) {
    await seedDatabase();
  }

  server.listen(PORT, () => {
    console.log(
      `===================================================\n` +
      `  Mixer Fix Backend Server Running on Port ${PORT}\n` +
      `  API Endpoint: http://localhost:${PORT}/api\n` +
      `  Environment:  ${process.env.NODE_ENV || 'development'}\n` +
      `===================================================`
    );
  });
};

startServer();

export { app, server, io };
