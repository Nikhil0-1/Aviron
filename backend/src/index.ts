import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import avironRoutes from './routes/aviron';
import missionRoutes from './routes/missions';
import detectionRoutes from './routes/detections';
import survivorRoutes from './routes/survivors';
import payloadRoutes from './routes/payload';
import alertRoutes from './routes/alerts';
import reportRoutes from './routes/reports';
import healthRoutes from './routes/health';
import storageRoutes from './routes/storage';
import profileRoutes from './routes/profiles';
import { initWebSocketServer } from './services/websocketService';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/aviron', avironRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/detections', detectionRoutes);
app.use('/api/survivors', survivorRoutes);
app.use('/api/payload', payloadRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/profiles', profileRoutes);

// Healthcheck endpoint
app.get('/api/ping', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'AVIRON Rescue Command Server v1.0.0',
    integrations: {
      firebase: 'ACTIVE',
      supabase: 'ACTIVE',
      cloudflareR2: 'ACTIVE',
    },
    time: new Date().toISOString(),
  });
});

// Create HTTP Server & attach WebSocket
const server = http.createServer(app);
initWebSocketServer(server);

server.listen(port, () => {
  console.log(`🚀 AVIRON Command Center Backend running on http://localhost:${port}`);
  console.log(`📡 WebSocket server live on ws://localhost:${port}/ws`);
});
