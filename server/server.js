import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

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

// ==========================================
// Production CORS Configuration
// ==========================================
const configuredClientUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/$/, ''))
  : [];

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const allowedOriginsSet = new Set([...configuredClientUrls, ...defaultAllowedOrigins]);

const corsOriginDelegate = (origin, callback) => {
  // Allow requests with no origin (e.g. mobile apps, curl, Razorpay webhooks)
  if (!origin) {
    return callback(null, true);
  }

  // Check explicit match or Vercel production/preview domain (*.vercel.app)
  const isExplicitlyAllowed = allowedOriginsSet.has(origin);
  const isVercelDomain = /^https:\/\/[a-zA-Z0-9-_.]+\.vercel\.app$/.test(origin);

  if (isExplicitlyAllowed || isVercelDomain || process.env.NODE_ENV !== 'production') {
    return callback(null, true);
  }

  console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
  callback(new Error(`CORS origin ${origin} is not allowed by Mixer Fix API.`));
};

const corsOptions = {
  origin: corsOriginDelegate,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Razorpay-Signature'],
};

// Configure Socket.IO with matching CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: corsOriginDelegate,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Attach io to Express app for use in controllers
app.set('io', io);

// Core Middleware
app.use(cors(corsOptions));

// JSON Parser with rawBody capture for Razorpay Webhook HMAC signature verification
app.use(
  express.json({
    limit: '25mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static route for uploaded images and videos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Service Information
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'Mixer Fix – Smart Electronic Repair Service API',
    status: 'online',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Production Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    service: 'Mixer Fix API Server',
    database: dbStatus,
    databaseName: mongoose.connection.name || 'mixerfix',
    version: '1.0.0',
    uptime: `${Math.floor(process.uptime())}s`,
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
  socket.on('join:room', (room) => {
    socket.join(room);
  });

  socket.on('leave:room', (room) => {
    socket.leave(room);
  });

  socket.on('disconnect', () => {
    // Client disconnected
  });
});

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

// Production Host and Port configuration (Render requires 0.0.0.0)
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  const dbConnected = await connectDB();
  if (dbConnected) {
    await seedDatabase();
  }

  server.listen(PORT, HOST, () => {
    console.log(
      `===================================================\n` +
      `  Mixer Fix Backend Server Running\n` +
      `  Address:     http://${HOST}:${PORT}\n` +
      `  Health:      http://${HOST}:${PORT}/api/health\n` +
      `  Environment: ${process.env.NODE_ENV || 'development'}\n` +
      `===================================================`
    );
  });
};

startServer();

export { app, server, io };
